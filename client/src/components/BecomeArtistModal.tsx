import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, FileText, CheckCircle } from "lucide-react";

interface BecomeArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BecomeArtistModal({ open, onOpenChange }: BecomeArtistModalProps) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      // In a real app, this would send to backend
      console.log("Artist application:", { email });
      setSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
        onOpenChange(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t('store.becomeArtistTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('store.becomeArtistDesc')}
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{t('store.artistRequirement1')}</p>
                  <p className="text-sm text-muted-foreground">{t('store.artistRequirement1Desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{t('store.artistRequirement2')}</p>
                  <p className="text-sm text-muted-foreground">{t('store.artistRequirement2Desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{t('store.artistRequirement3')}</p>
                  <p className="text-sm text-muted-foreground">{t('store.artistRequirement3Desc')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('store.emailLabel')}</label>
              <Input
                type="email"
                placeholder={t('store.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!email.trim()}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('store.submitApplication')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <div>
              <p className="font-semibold text-lg">{t('store.applicationSent')}</p>
              <p className="text-sm text-muted-foreground mt-2">{t('store.applicationSentDesc')}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
