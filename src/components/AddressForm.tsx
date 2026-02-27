"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import tmoApi from "@/lib/tmoApi";
import { TMOAddress, TMOGeoItem } from "@/types/tmo";

interface AddressFormProps {
  initialData?: TMOAddress | null;
  userInfo: {
    firstname: string;
    lastname: string;
    mobile: string;
  };
  onSave: (payload: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  userInfo,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useTranslation("common");

  // Form fields (name and mobile come from userInfo)
  const [street, setStreet] = useState(initialData?.street?.[0] || "");
  const [postcode, setPostcode] = useState(initialData?.postcode || "");
  const [defaultBilling, setDefaultBilling] = useState(initialData?.default_billing || false);

  // China geo data (from API)
  const [regions, setRegions] = useState<TMOGeoItem[]>([]);
  const [cities, setCities] = useState<TMOGeoItem[]>([]);
  const [districts, setDistricts] = useState<TMOGeoItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load regions on mount
  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    setLoadingRegions(true);
    try {
      const data = await tmoApi.getRegions();
      setRegions(data);
    } catch (error) {
      console.error("Failed to load regions:", error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadCities = async (regionId: string) => {
    setLoadingCities(true);
    setCities([]);
    setDistricts([]);
    setSelectedCity("");
    setSelectedDistrict("");
    try {
      const data = await tmoApi.getCities(regionId);
      setCities(data);
    } catch (error) {
      console.error("Failed to load cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadDistricts = async (cityId: string) => {
    setLoadingDistricts(true);
    setDistricts([]);
    setSelectedDistrict("");
    try {
      const data = await tmoApi.getDistricts(cityId);
      setDistricts(data);
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    if (regionId) {
      loadCities(regionId);
    } else {
      setCities([]);
      setDistricts([]);
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    if (cityId) {
      loadDistricts(cityId);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    if (errors.district) {
      setErrors((prev) => ({ ...prev, district: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!selectedDistrict) {
      newErrors.district = t("checkout.fieldRequired");
      isValid = false;
    }
    if (!street.trim()) {
      newErrors.street = t("checkout.fieldRequired");
      isValid = false;
    }
    if (!postcode.trim()) {
      newErrors.postcode = t("checkout.fieldRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build address payload matching API format
    // Use userInfo for name and mobile (from user's profile)
    const payload = {
      address: {
        id: initialData?.id,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        postcode: postcode.trim(),
        street: [street.trim()],
        telephone: userInfo.mobile,
        custom_attributes: [
          {
            attribute_code: "district_id",
            value: parseInt(selectedDistrict, 10),
          },
          {
            attribute_code: "mobile_prefix",
            value: "+86",
          },
          {
            attribute_code: "mobile",
            value: userInfo.mobile,
          },
        ],
      },
      default_billing: defaultBilling,
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Region -> City -> District */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region" className="text-foreground">
            {t("checkout.region")}
          </Label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            disabled={loadingRegions}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">{loadingRegions ? "Loading..." : t("checkout.selectRegion")}</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-foreground">
            {t("checkout.city")}
          </Label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={loadingCities || cities.length === 0}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="district" className="text-foreground">
            District *
          </Label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={loadingDistricts || districts.length === 0}
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${errors.district ? "border-red-500" : ""}`}
          >
            <option value="">{loadingDistricts ? "Loading..." : "Select District"}</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-xs">{errors.district}</p>
          )}
        </div>
      </div>

      {/* Street Address */}
      <div className="space-y-2">
        <Label htmlFor="street" className="text-foreground">
          {t("checkout.streetAddress")} *
        </Label>
        <Input
          id="street"
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
            if (errors.street) setErrors((prev) => ({ ...prev, street: "" }));
          }}
          className={errors.street ? "border-red-500" : ""}
        />
        {errors.street && (
          <p className="text-red-500 text-xs">{errors.street}</p>
        )}
      </div>

      {/* Postcode */}
      <div className="space-y-2">
        <Label htmlFor="postcode" className="text-foreground">
          {t("checkout.postalCode")} *
        </Label>
        <Input
          id="postcode"
          value={postcode}
          onChange={(e) => {
            setPostcode(e.target.value);
            if (errors.postcode) setErrors((prev) => ({ ...prev, postcode: "" }));
          }}
          className={errors.postcode ? "border-red-500" : ""}
        />
        {errors.postcode && (
          <p className="text-red-500 text-xs">{errors.postcode}</p>
        )}
      </div>

      {/* Default Billing */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="default_billing"
          checked={defaultBilling}
          onChange={(e) => setDefaultBilling(e.target.checked)}
          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
        <Label htmlFor="default_billing" className="text-foreground text-sm">
          {t("userSettings.addresses.defaultBilling")}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("projects.delete.cancel")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("userSettings.profile.saveChanges")}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
