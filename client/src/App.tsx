import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { useAuth } from "./_core/hooks/useAuth";
import MyAvatars from "./pages/MyAvatars";
import Store from "./pages/Store";

import Tutorials from "./pages/Tutorials";
import History from "./pages/History";
import Credits from "./pages/Credits";

import Updates from "./pages/Updates";
import ShoppingCart from "./pages/ShoppingCart";
import ProductDetail from "./pages/ProductDetail";
import { MyCollection } from "./pages/MyCollection";
import Blog from "./pages/Blog";
import { FAQ } from "./pages/FAQ";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { CookiesPolicy } from "./pages/CookiesPolicy";
import PublishingTool from "./pages/PublishingTool";
import KanbanReview from "./pages/KanbanReview";
import AssetManagement from "./pages/AssetManagement";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import WeChatCallback from "./pages/WeChatCallback";


function AuthGate() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  return isAuthenticated ? <Home /> : <Landing />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={AuthGate} />
      <Route path={"/my-avatars"} component={MyAvatars} />
      <Route path={"/store"} component={Store} />
      <Route path={"/product/:sku"} component={ProductDetail} />
      <Route path={"/tutorials"} component={Tutorials} />
      <Route path={"/history"} component={History} />
      <Route path={"/credits"} component={Credits} />

      <Route path={"/updates"} component={Updates} />
      <Route path={"/shopping-cart"} component={ShoppingCart} />
      <Route path={"/my-collection"} component={MyCollection} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:articleId"} component={Blog} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/terms"} component={TermsAndConditions} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/cookies"} component={CookiesPolicy} />
      <Route path={"/publishing-tool"} component={PublishingTool} />
      <Route path={"/kanban-review"} component={KanbanReview} />
      <Route path={"/asset-management"} component={AssetManagement} />
      <Route path={"/artists"} component={Artists} />
      <Route path={"/artist/:id"} component={ArtistDetail} />
      <Route path={"/auth/wechat/callback"} component={WeChatCallback} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light" switchable>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Router />
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
