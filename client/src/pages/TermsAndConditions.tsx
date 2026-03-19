import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {isZh ? "返回首页" : "Back to Home"}
          </Link>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="mb-8 border-b pb-6">
            <p className="text-sm text-muted-foreground mb-1">
              {isZh ? "版本生效时间：2026 年 3 月 20 日" : "Effective Date: March 20, 2026"}
            </p>
            <h1 className="text-3xl font-bold mt-2 text-foreground">
              {isZh
                ? "亘吉资源商店用户服务条款及最终用户许可协议"
                : "GENJI Asset Store Terms of Service and EULA"}
            </h1>
          </div>

          <div className="space-y-2 mb-8 text-sm leading-relaxed text-muted-foreground">
            {isZh ? (
              <>
                <p>欢迎您使用亘吉资源商店（以下简称"本服务"）！</p>
                <p>为使用本服务，您应当约定并遵守《亘吉资源商店用户服务条款及最终用户许可协议》、《亘吉资源商店个人信息处理规则》及其他适用的业务规则。请您务必审慎阅读、充分理解各条款内容，特别是限制或免除平台经营者责任的条款、对用户权利进行限制的条款、约定争议解决方式和司法管辖的条款，以及开通或使用某项服务的单独协议或规则。</p>
                <p>除非您已阅读、完全理解并接受本协议所有条款，否则您无权使用本服务。您点击"同意"，或您使用本服务，均视为您已阅读并同意签署本协议。</p>
                <p>我们不面向不满14周岁的儿童提供服务。如果您是未满18周岁的未成年人，请在法定监护人的陪同下阅读并判断是否同意本协议。</p>
              </>
            ) : (
              <>
                <p>Welcome to use GENJI Asset Store (hereinafter referred to as the "Service")!</p>
                <p>To utilize the Service, you must agree to and comply with the GENJI Asset Store Terms of Service and EULA, the GENJI Asset Store Personal Information Processing Rules, and all other applicable operational guidelines. Please ensure you carefully read and fully understand all terms, particularly those regarding the limitation or exclusion of the Platform Operator's liability, restrictions on user rights, and dispute resolution mechanisms.</p>
                <p>You are not authorized to use the Service unless you have read, fully understood, and accepted all terms of this Agreement. By clicking "Agree" or using the Service, you are deemed to have read and agreed to sign this Agreement.</p>
                <p>We do not provide services to children under the age of 14. If you are a minor under the age of 18, please read this Agreement accompanied by a legal guardian.</p>
              </>
            )}
          </div>

          {isZh ? (
            <div className="space-y-2">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"1.\u3010\u534f\u8bae\u8303\u56f4\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"1.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u7531\u5a01\u800c\u68ee\uff08\u4e0a\u6d77\uff09\u8d38\u6613\u6709\u9650\u516c\u53f8\u53ca\u5176\u5173\u8054\u65b9\uff08\u201c\u5e73\u53f0\u7ecf\u8425\u8005\u201d\uff09\u62e5\u6709\u5e76\u8fd0\u8425\u3002\u60a8\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u53d7\u8fd9\u4e9b\u8d44\u6e90\u5546\u5e97\u670d\u52a1\u6761\u6b3e\uff08\u201c\u6761\u6b3e\u201d\uff09\u7684\u7ea6\u675f\u3002\u5728\u672c\u534f\u8bae\u4e2d\uff0c\u201c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u201d\u5177\u6709\u5e7f\u4e49\u542b\u4e49\uff0c\u5e76\u540c\u6837\u6307\u4ee3\u201c\u4e98\u5409 Studio\u201d\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6b64\u5916\uff0c\u60a8\u4ece\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u83b7\u5f97\u8bb8\u53ef\uff0c\u8be5\u8bb8\u53ef\u7531\u5e73\u53f0\u7ecf\u8425\u8005\u63d0\u4f9b\uff0c\u4e14\u90fd\u5c06\u53d7\u5e73\u53f0\u7ecf\u8425\u8005\u7684\u6807\u51c6\u6700\u7ec8\u7528\u6237\u8bb8\u53ef\u534f\u8bae\uff08\u201cEULA\u201d\uff09\u7684\u7ea6\u675f\uff0c\u9644\u5f551\u662f\u6700\u7ec8\u7528\u6237\u8bb8\u53ef\u534f\u8bae\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u53ef\u4ee5\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6d4f\u89c8\u3001\u5b9a\u4f4d\u548c\u4e0b\u8f7d\u8d44\u6e90\uff08\u5b9a\u4e49\u4e3a(i)\u5305\u542b\u56fe\u5f62\u5143\u7d20\u3001\u9053\u5177\u3001\u7c7b\u4eba\u7279\u5f81\u6216\u529f\u80fd\u5c5e\u6027\u76842D\u62163D\u6587\u4ef6\uff1b\u4ee5\u53ca(ii)\u53ef\u76f4\u63a5\u5728\u4e98\u5409 Studio\u4e2d\u4f7f\u7528\u6216\u5bfc\u51fa\u76843D\u865a\u62df\u5f62\u8c61\uff09\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u6709\u6743\u5bf9\u672c\u534f\u8bae\u8fdb\u884c\u8c03\u6574\u6216\u8865\u5145\u3002\u82e5\u60a8\u7ee7\u7eed\u4f7f\u7528\u672c\u670d\u52a1\u7684\uff0c\u5219\u89c6\u4e3a\u63a5\u53d7\u8be5\u7b49\u8c03\u6574\u6216\u8865\u5145\uff0c\u5982\u679c\u60a8\u4e0d\u63a5\u53d7\u8c03\u6574\u6216\u8865\u5145\uff0c\u5e94\u7acb\u5373\u505c\u6b62\u4f7f\u7528\u8be5\u670d\u52a1\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"2.\u3010\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6240\u63d0\u4f9b\u7684\u4ea7\u54c1\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"2.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u540c\u610f\u5e73\u53f0\u7ecf\u8425\u8005\u53ef\u4ee5\u81ea\u884c\u51b3\u5b9a\uff08\u6c38\u4e45\u6216\u6682\u65f6\uff09\u505c\u6b62\u5411\u60a8\u6216\u7528\u6237\u63d0\u4f9b\u4e98\u5409\u8d44\u6e90\u5546\u5e97\uff08\u6216\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e2d\u7684\u4efb\u4f55\u529f\u80fd\uff09\uff0c\u800c\u65e0\u9700\u4e8b\u5148\u901a\u77e5\u60a8\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u53ef\u80fd\u4f1a\u96c6\u6210\u7b2c\u4e09\u65b9\u652f\u4ed8\u670d\u52a1\uff0c\u4ee5\u65b9\u4fbf\u60a8\u4ece\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u8d2d\u4e70\u8d44\u6e90\u3002\u60a8\u540c\u610f\u5e73\u53f0\u7ecf\u8425\u8005\u4fdd\u7559\u81ea\u884c\u51b3\u5b9a\u6dfb\u52a0\u6216\u5220\u9664\u652f\u4ed8\u65b9\u5f0f\u7684\u6743\u5229\uff0c\u800c\u65e0\u9700\u901a\u77e5\u60a8\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u53ef\u80fd\u4f1a\u5728\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0a\u53d1\u73b0\u8fdd\u53cd\u76f8\u5173\u534f\u8bae\u6216\u6cd5\u5f8b\u6cd5\u89c4\u7684\u8d44\u4ea7\u3002\u60a8\u540c\u610f\uff0c\u5728\u8fd9\u79cd\u60c5\u51b5\u4e0b\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u4fdd\u7559\u8981\u6c42\u4ece\u60a8\u63a7\u5236\u7684\u4efb\u4f55\u8ba1\u7b97\u673a\u6216\u5176\u4ed6\u8bbe\u5907\u4e2d\u5220\u9664\u6b64\u7c7b\u8d44\u4ea7\u7684\u6743\u5229\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u7406\u89e3\u5e76\u540c\u610f\uff0c\u5e73\u53f0\u8fd0\u8425\u65b9\u6709\u6743\u5728\u5176\u8ba4\u4e3a\u5fc5\u8981\u65f6\uff0c\u5728\u63d0\u524d\u901a\u77e5\u7684\u60c5\u51b5\u4e0b\uff0c\u81ea\u884c\u51b3\u5b9a\u4fee\u6539\u201c\u4e98\u5409 Studio\u201d\u53ca\u201c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u201d\u7684\u5546\u4e1a\u6a21\u5f0f\uff08\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\uff1a\u652f\u4ed8\u65b9\u5f0f\u3001\u8d44\u6e90\u6240\u6709\u6743\u7ed3\u6784\u3001\u8ba2\u9605\u670d\u52a1\u65b9\u6848\u7b49\uff09\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"3.\u3010\u8d26\u53f7\u6ce8\u518c\u4e0e\u4f7f\u7528\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"3.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u5728\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u670d\u52a1\u65f6\u53ef\u80fd\u9700\u8981\u6ce8\u518c\u4e00\u4e2a\u8d26\u53f7\u3002\u8be5\u8d26\u53f7\u7531\u5e73\u53f0\u7ecf\u8425\u8005\u7684\u76f8\u5173\u516c\u53f8\u5408\u6cd5\u62e5\u6709\uff0c\u8d26\u53f7\u4f7f\u7528\u6743\u4ec5\u5c5e\u4e8e\u521d\u59cb\u7533\u8bf7\u6ce8\u518c\u4eba\uff0c\u7981\u6b62\u8d60\u4e0e\u3001\u501f\u7528\u3001\u79df\u7528\u3001\u8f6c\u8ba9\u6216\u552e\u5356\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u8bb8\u53ef\u4ed6\u4eba\u4f7f\u7528\u8be5\u8d26\u53f7\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u6709\u6743\u8981\u6c42\u60a8\u6309\u7167\u6211\u56fd\u6cd5\u5f8b\u89c4\u5b9a\u5b8c\u6210\u5b9e\u540d\u8ba4\u8bc1\u3002\u82e5\u60a8\u63d0\u4ea4\u7684\u6750\u6599\u6216\u63d0\u4f9b\u7684\u4fe1\u606f\u4e0d\u51c6\u786e\u3001\u4e0d\u771f\u5b9e\u3001\u4e0d\u89c4\u8303\u3001\u4e0d\u5408\u6cd5\uff0c\u5219\u5e73\u53f0\u7ecf\u8425\u8005\u6709\u6743\u62d2\u7edd\u4e3a\u60a8\u63d0\u4f9b\u76f8\u5173\u670d\u52a1\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u540c\u610f\u4e0d\u901a\u8fc7\u5e73\u53f0\u7ecf\u8425\u8005\u63d0\u4f9b\u7684\u754c\u9762\u4ee5\u5916\u7684\u4efb\u4f55\u65b9\u5f0f\u8bbf\u95ee\uff08\u6216\u5c1d\u8bd5\u8bbf\u95ee\uff09\u4e98\u5409\u8d44\u6e90\u5546\u5e97\uff0c\u9664\u975e\u60a8\u5728\u4e0e\u5e73\u53f0\u7ecf\u8425\u8005\u7684\u5355\u72ec\u534f\u8bae\u4e2d\u88ab\u7279\u522b\u5141\u8bb8\u8fd9\u6837\u505a\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u540c\u610f\u60a8\u4e0d\u4f1a\u53c2\u4e0e\u4efb\u4f55\u5e72\u6270\u6216\u7834\u574f\u4e98\u5409\u8d44\u6e90\u5546\u5e97\uff08\u6216\u8fde\u63a5\u5230\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u7684\u670d\u52a1\u5668\u3001\u652f\u4ed8\u7cfb\u7edf\u6216\u7f51\u7edc\uff09\u7684\u6d3b\u52a8\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.5"</span>
                <span className="text-muted-foreground leading-relaxed">"\u9664\u975e\u5728\u4e0e\u5e73\u53f0\u7ecf\u8425\u8005\u7684\u5355\u72ec\u534f\u8bae\u4e2d\u660e\u786e\u5141\u8bb8\uff0c\u5426\u5219\u60a8\u540c\u610f\u60a8\u4e0d\u4f1a\u590d\u5236\u3001\u5206\u53d1\u3001\u8f6c\u8ba9\u3001\u8bb8\u53ef\u3001\u518d\u8bb8\u53ef\u3001\u51fa\u79df\u3001\u51fa\u501f\u3001\u51fa\u552e\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u76f4\u63a5\u5546\u4e1a\u5316\u4ece\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6216\u4e98\u5409 Studio\u83b7\u5f97\u8bb8\u53ef\u7684\u4efb\u4f55\u8d44\u6e90\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.6"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u540c\u610f\uff0c\u5bf9\u4e8e\u60a8\u5bf9\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u53ca\u4efb\u4f55\u8d44\u6e90\u7684\u4f7f\u7528\u3001\u60a8\u8fdd\u53cd\u672c\u6761\u6b3e\u89c4\u5b9a\u7684\u4efb\u4f55\u4e49\u52a1\u4ee5\u53ca\u4efb\u4f55\u6b64\u7c7b\u8fdd\u53cd\u884c\u4e3a\u7684\u540e\u679c\uff0c\u60a8\u5e94\u81ea\u884c\u8d1f\u8d23\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.7"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u7406\u89e3\u5e76\u540c\u610f\uff0c\u672c\u5e73\u53f0\u4e0a\u7684\u8d44\u6e90\u5c5e\u4e8e\u6570\u5b57\u5316\u5546\u54c1\uff0c\u5747\u4e0d\u9002\u7528\u4e03\u65e5\u65e0\u7406\u7531\u9000\u8d27\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"4.\u3010\u77e5\u8bc6\u4ea7\u6743\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"4.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u540c\u610f\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u548c/\u6216\u7b2c\u4e09\u65b9\u62e5\u6709\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u548c\u901a\u8fc7\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u63d0\u4f9b\u7684\u8d44\u4ea7\u7684\u6240\u6709\u6743\u5229\u3001\u6240\u6709\u6743\u548c\u5229\u76ca\uff0c\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\u6240\u6709\u9002\u7528\u77e5\u8bc6\u4ea7\u6743\u3002\u4f60\u540c\u610f\uff0c\u4f60\u4e0d\u4f1a\uff0c\u4e5f\u4e0d\u5141\u8bb8\u4efb\u4f55\u7b2c\u4e09\u65b9\uff1a(i)\u5bf9\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u3001\u4e98\u5409 Studio\u6216\u8d44\u6e90\u8fdb\u884c\u53cd\u7f16\u8bd1\u3001\u53cd\u5411\u5de5\u7a0b\u3001\u53cd\u6c47\u7f16\uff1b(ii)\u91c7\u53d6\u4efb\u4f55\u884c\u52a8\u89c4\u907f\u6216\u7834\u574f\u5b89\u5168\u6216\u5185\u5bb9\u4f7f\u7528\u89c4\u5219\uff1b(iii)\u5728\u8fdd\u53cd\u4efb\u4f55\u6cd5\u5f8b\u6216\u7b2c\u4e09\u65b9\u6743\u5229\u7684\u60c5\u51b5\u4e0b\uff0c\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6216\u8d44\u6e90\uff1b(iv)\u79fb\u9664\u3001\u63a9\u76d6\u6216\u66f4\u6539\u7248\u6743\u58f0\u660e\u3001\u5546\u6807\u6216\u5176\u4ed6\u4e13\u6709\u6743\u5229\u58f0\u660e\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e2d\u6240\u4f7f\u7528\u7684\u4e98\u5409\u6807\u5fd7\u548c\u5546\u6807\u7684\u6240\u6709\u6743\u5229\u5747\u5f52\u5c5e\u5a01\u800c\u68ee\uff08\u4e0a\u6d77\uff09\u8d38\u6613\u6709\u9650\u516c\u53f8\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"5.\u3010\u4fb5\u6743\u884c\u4e3a\u4e3e\u62a5\u4e0e\u6295\u8bc9\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"5.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u5c0a\u91cd\u6bcf\u4f4d\u7528\u6237\u7684\u77e5\u8bc6\u4ea7\u6743\uff0c\u4e5f\u5e0c\u671b\u7528\u6237\u5728\u4f7f\u7528\u672c\u670d\u52a1\u65f6\u53ef\u4ee5\u9075\u5b88\u4e2d\u56fd\u6cd5\u5f8b\u6709\u5173\u77e5\u8bc6\u4ea7\u6743\u7684\u89c4\u5b9a\u3002\u5982\u7528\u6237\u5728\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0a\u53d1\u8868\u7684\u5185\u5bb9\u4fb5\u72af\u4e86\u7b2c\u4e09\u65b9\u7684\u8457\u4f5c\u6743\u6216\u5176\u4ed6\u6743\u5229\uff0c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6709\u6743\u4f9d\u7167\u6cd5\u5f8b\u89c4\u5b9a\u8fdb\u884c\u5904\u7406\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5982\u679c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u53d1\u73b0\u6216\u6536\u5230\u4ed6\u4eba\u4e3e\u62a5\u6216\u6295\u8bc9\u7528\u6237\u8fdd\u53cd\u672c\u534f\u8bae\u6709\u5173\u7ea6\u5b9a\u7684\uff0c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6709\u6743\u5728\u4e0d\u901a\u77e5\u6d89\u5acc\u4fb5\u6743\u7684\u7528\u6237\u7684\u60c5\u51b5\u4e0b\uff0c\u5bf9\u6d89\u5acc\u4fb5\u6743\u7684\u5185\u5bb9\u53ca\u7528\u6237\u8d44\u6599\u8fdb\u884c\u5ba1\u67e5\uff0c\u5e76\u91c7\u53d6\u5220\u9664\u3001\u5c4f\u853d\u3001\u65ad\u5f00\u94fe\u63a5\u7b49\u5904\u7406\u63aa\u65bd\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5982\u679c\u6743\u5229\u4eba\u6216\u5176\u5408\u6cd5\u4ee3\u7406\u4eba\u53d1\u73b0\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u5e73\u53f0\u5b58\u5728\u4fb5\u72af\u81ea\u8eab\u5408\u6cd5\u6743\u76ca\u7684\u5185\u5bb9\uff0c\u53ef\u5411\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u8fdb\u884c\u6295\u8bc9\u3002\u6295\u8bc9\u90ae\u7bb1\uff1aassetstore-support@unity.cn"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6709\u6743\u5bf9\u7528\u6237\u4f7f\u7528\u670d\u52a1\u548c\u4ea7\u54c1\u7684\u60c5\u51b5\u8fdb\u884c\u5ba1\u67e5\u548c\u76d1\u7763\uff0c\u5982\u7528\u6237\u5728\u4f7f\u7528\u670d\u52a1\u65f6\u5b58\u5728\u4efb\u4f55\u8fdd\u53cd\u672c\u534f\u8bae\u89c4\u5b9a\u7684\u60c5\u5f62\uff0c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6709\u6743\u8981\u6c42\u7528\u6237\u9650\u671f\u6539\u6b63\u6216\u76f4\u63a5\u91c7\u53d6\u4e00\u5207\u5fc5\u8981\u7684\u63aa\u65bd\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.5"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5982\u679c\u4efb\u4f55\u7b2c\u4e09\u65b9\u4fb5\u72af\u4e86\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u7528\u6237\u7684\u76f8\u5173\u6743\u5229\uff0c\u7528\u6237\u540c\u610f\u6388\u6743\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6216\u5176\u6307\u5b9a\u7684\u4ee3\u7406\u4eba\u4ee3\u8868\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u81ea\u8eab\u6216\u7528\u6237\u72ec\u7acb\u5730\u5bf9\u8be5\u7b2c\u4e09\u65b9\u8fdb\u884c\u4fb5\u6743\u884c\u4e3a\u76d1\u6d4b\u3001\u5bf9\u4fb5\u6743\u884c\u4e3a\u63d0\u51fa\u8b66\u544a\u3001\u6295\u8bc9\u3001\u53d1\u8d77\u884c\u653f\u6267\u6cd5\u3001\u8bc9\u8bbc\u3001\u8fdb\u884c\u4e0a\u8bc9\u6216\u8c08\u5224\u548c\u89e3\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"6.\u3010\u7528\u6237\u884c\u4e3a\u89c4\u8303\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"6.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u7406\u89e3\u5e76\u540c\u610f\uff0c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u81f4\u529b\u4e8e\u4e3a\u7528\u6237\u63d0\u4f9b\u6587\u660e\u5065\u5eb7\u3001\u89c4\u8303\u6709\u5e8f\u7684\u7f51\u7edc\u73af\u5883\uff0c\u60a8\u4e0d\u5f97\u5728\u672c\u670d\u52a1\u4e2d\u590d\u5236\u3001\u53d1\u5e03\u3001\u4f20\u64ad\u5e72\u6270\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6b63\u5e38\u8fd0\u8425\uff0c\u4ee5\u53ca\u4fb5\u72af\u5176\u4ed6\u7528\u6237\u6216\u7b2c\u4e09\u65b9\u5408\u6cd5\u6743\u76ca\u7684\u5185\u5bb9\uff0c\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\uff1a\u8fdd\u53cd\u56fd\u5bb6\u6cd5\u5f8b\u6cd5\u89c4\u7981\u6b62\u7684\u5185\u5bb9\uff1b\u4fb5\u5bb3\u4ed6\u4eba\u540d\u8a89\u6743\u3001\u8096\u50cf\u6743\u3001\u77e5\u8bc6\u4ea7\u6743\u3001\u5546\u4e1a\u79d8\u5bc6\u7b49\u5408\u6cd5\u6743\u5229\u7684\u5185\u5bb9\uff1b\u6d89\u53ca\u4ed6\u4eba\u9690\u79c1\u3001\u4e2a\u4eba\u4fe1\u606f\u6216\u8d44\u6599\u7684\u5185\u5bb9\uff1b\u9a9a\u6270\u3001\u5e7f\u544a\u4fe1\u606f\u3001\u8fc7\u5ea6\u8425\u9500\u4fe1\u606f\u53ca\u5783\u573e\u4fe1\u606f\uff1b\u5176\u4ed6\u8fdd\u53cd\u6cd5\u5f8b\u6cd5\u89c4\u3001\u653f\u7b56\u53ca\u516c\u5e8f\u826f\u4fd7\u7684\u4fe1\u606f\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"7.\u3010\u5e73\u53f0\u7ecf\u8425\u8005\u670d\u52a1\u4e0e\u7b2c\u4e09\u65b9\u8d44\u6e90\u548c\u670d\u52a1\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"7.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8d44\u6e90\u7684\u67d0\u4e9b\u7ec4\u4ef6\uff08\u65e0\u8bba\u7531\u5e73\u53f0\u7ecf\u8425\u8005\u6216\u7b2c\u4e09\u65b9\u5f00\u53d1\uff09\u4e5f\u53ef\u80fd\u53d7\u7b2c\u4e09\u65b9\u8f6f\u4ef6\u8bb8\u53ef\u8bc1\u7684\u7ea6\u675f\u3002\u5982\u679c\u672c\u534f\u8bae\u4e66\u4e0e\u4efb\u4f55\u6b64\u7c7b\u8bb8\u53ef\u8bc1\u4e4b\u95f4\u53d1\u751f\u51b2\u7a81\uff0c\u4ec5\u5c31\u8fd9\u4e9b\u7ec4\u4ef6\u800c\u8a00\uff0c\u5e94\u4ee5\u7b2c\u4e09\u65b9\u8f6f\u4ef6\u8bb8\u53ef\u8bc1\u4e3a\u51c6\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"8.\u3010\u81ea\u52a8\u66f4\u65b0\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"8.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u548c\u4f9b\u5e94\u5546\u7684\u8d44\u6e90\u53ef\u80fd\u4f1a\u4e0d\u65f6\u4e0e\u5e73\u53f0\u7ecf\u8425\u8005\u670d\u52a1\u5668\u6216\u4f9b\u5e94\u5546\u7684\u670d\u52a1\u5668\u901a\u4fe1\uff0c\u4ee5\u68c0\u67e5\u8d44\u6e90\u5546\u5e97\u548c\u8d44\u6e90\u7684\u53ef\u7528\u66f4\u65b0\uff0c\u5982\u9519\u8bef\u4fee\u590d\u3001\u8865\u4e01\u3001\u589e\u5f3a\u529f\u80fd\u3001\u7f3a\u5931\u7684\u63d2\u4ef6\u548c\u65b0\u7248\u672c\uff08\u7edf\u79f0\u201c\u66f4\u65b0\u201d\uff09\u3002\u901a\u8fc7\u5b89\u88c5\u8fd9\u4e9b\u8d44\u4ea7\uff0c\u60a8\u540c\u610f\u6b64\u7c7b\u81ea\u52a8\u8bf7\u6c42\u548c\u63a5\u6536\u7684\u66f4\u65b0\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"9.\u3010\u8d54\u507f\u6761\u6b3e\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"9.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5728\u6cd5\u5f8b\u5141\u8bb8\u7684\u6700\u5927\u8303\u56f4\u5185\uff0c\u60a8\u540c\u610f\u4e3a\u5e73\u53f0\u7ecf\u8425\u8005\u3001\u5176\u9644\u5c5e\u673a\u6784\u53ca\u5176\u5404\u81ea\u7684\u9ad8\u7ea7\u804c\u5458\u3001\u96c7\u5458\u548c\u4ee3\u7406\u4eba\u8fa9\u62a4\u3001\u8d54\u507f\u5e76\u4f7f\u5176\u514d\u53d7\u4efb\u4f55\u53ca\u6240\u6709\u7d22\u8d54\u3001\u8bc9\u8bbc\u3001\u63a7\u544a\u6216\u7a0b\u5e8f\uff0c\u4ee5\u53ca\u56e0\u60a8\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\uff08\u5305\u62ec\u60a8\u8bb8\u53ef\u3001\u4e0b\u8f7d\u3001\u5b89\u88c5\u6216\u4f7f\u7528\u4efb\u4f55\u8d44\u4ea7\uff0c\u6216\u60a8\u8fdd\u53cd\u8fd9\u4e9b\u6761\u6b3e\uff09\u800c\u5f15\u8d77\u6216\u7d2f\u79ef\u7684\u4efb\u4f55\u53ca\u6240\u6709\u635f\u5931\u3001\u8d23\u4efb\u3001\u635f\u5bb3\u3001\u6210\u672c\u548c\u8d39\u7528\uff08\u5305\u62ec\u5408\u7406\u7684\u5f8b\u5e08\u8d39\uff09\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"10.\u3010\u5408\u540c\u7ec8\u6b62\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"10.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8fd9\u4e9b\u6761\u6b3e\u5c06\u7ee7\u7eed\u9002\u7528\uff0c\u76f4\u5230\u60a8\u6216\u5e73\u53f0\u7ecf\u8425\u8005\u6309\u4ee5\u4e0b\u89c4\u5b9a\u7ec8\u6b62\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"10.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5982\u679c\u60a8\u60f3\u7ec8\u6b62\u8fd9\u4e9b\u6761\u6b3e\uff0c\u60a8\u53ef\u4ee5\u901a\u8fc7\u505c\u6b62\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u548c\u4ece\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0b\u8f7d\u7684\u4efb\u4f55\u8d44\u6e90\u6765\u5b9e\u73b0\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"10.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5728\u4e0b\u5217\u60c5\u51b5\u4e0b\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u53ef\u968f\u65f6\u4e0e\u60a8\u7ec8\u6b62\u672c\u6761\u6b3e\uff1a(a)\u60a8\u8fdd\u53cd\u4e86\u672c\u6761\u6b3e\u7684\u4efb\u4f55\u89c4\u5b9a\uff1b\u6216(b)\u6cd5\u5f8b\u8981\u6c42\u5e73\u53f0\u7ecf\u8425\u8005\u8fd9\u6837\u505a\uff1b\u6216(c)\u5e73\u53f0\u7ecf\u8425\u8005\u51b3\u5b9a\u4e0d\u518d\u63d0\u4f9b\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"10.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5f53\u8fd9\u4e9b\u6761\u6b3e\u7ed3\u675f\u65f6\uff0c\u60a8\u548c\u5e73\u53f0\u7ecf\u8425\u8005\u5df2\u7ecf\u4eab\u6709\u7684\u6240\u6709\u6cd5\u5f8b\u6743\u5229\u3001\u4e49\u52a1\u548c\u8d23\u4efb\uff0c\u5e94\u4e0d\u53d7\u8fd9\u79cd\u505c\u6b62\u7684\u5f71\u54cd\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"11.\u3010\u514d\u8d23\u58f0\u660e\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"11.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u660e\u786e\u7406\u89e3\u5e76\u540c\u610f\uff0c\u60a8\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4ee5\u53ca\u901a\u8fc7\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0b\u8f7d\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u83b7\u5f97\u7684\u4efb\u4f55\u8d44\u6e90\u7684\u98ce\u9669\u7531\u60a8\u81ea\u884c\u627f\u62c5\uff0c\u5e76\u4e14\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u662f\u6309\u539f\u6837\u548c\u53ef\u7528\u63d0\u4f9b\u7684\uff0c\u5728\u9002\u7528\u6cd5\u5f8b\u5141\u8bb8\u7684\u6700\u5927\u8303\u56f4\u5185\u6ca1\u6709\u4efb\u4f55\u5f62\u5f0f\u7684\u62c5\u4fdd\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u5bf9\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u53ca\u901a\u8fc7\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0b\u8f7d\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u83b7\u5f97\u7684\u4efb\u4f55\u8d44\u4ea7\u7684\u4f7f\u7528\u7531\u60a8\u81ea\u884c\u51b3\u5b9a\u5e76\u627f\u62c5\u98ce\u9669\uff0c\u60a8\u5bf9\u56e0\u6b64\u7c7b\u4f7f\u7528\u5bfc\u81f4\u7684\u60a8\u7684\u8ba1\u7b97\u673a\u7cfb\u7edf\u6216\u5176\u4ed6\u8bbe\u5907\u7684\u4efb\u4f55\u635f\u574f\u6216\u6570\u636e\u4e22\u5931\u8d1f\u5168\u90e8\u8d23\u4efb\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5728\u9002\u7528\u6cd5\u5f8b\u5141\u8bb8\u7684\u6700\u5927\u8303\u56f4\u5185\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u8fdb\u4e00\u6b65\u660e\u786e\u58f0\u660e\uff0c\u5bf9\u4e8e\u901a\u8fc7\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0b\u8f7d\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u83b7\u5f97\u7684\u4efb\u4f55\u8d44\u6e90\u4ee5\u53ca\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u672c\u8eab\uff0c\u4e0d\u63d0\u4f9b\u4efb\u4f55\u5f62\u5f0f\u7684\u660e\u793a\u6216\u6697\u793a\u7684\u4fdd\u8bc1\u6761\u6b3e\u6216\u6761\u4ef6\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6ca1\u6709\u4efb\u4f55\u8d44\u6e90\u6253\u7b97\u7528\u4e8e\u6838\u8bbe\u65bd\u3001\u751f\u547d\u652f\u6301\u7cfb\u7edf\u3001\u7d27\u6025\u901a\u4fe1\u3001\u98de\u673a\u5bfc\u822a\u6216\u901a\u4fe1\u7cfb\u7edf\u3001\u7a7a\u4e2d\u4ea4\u901a\u63a7\u5236\u7cfb\u7edf\u6216\u4efb\u4f55\u5176\u4ed6\u6b64\u7c7b\u6d3b\u52a8\u7684\u64cd\u4f5c\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.5"</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u5c06\u6839\u636e\u6cd5\u5f8b\u6cd5\u89c4\u7684\u8981\u6c42\u5bf9\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u7f51\u7ad9\u4e0a\u7684\u5546\u54c1\u3001\u670d\u52a1\u3001\u5e7f\u544a\u7b49\u4fe1\u606f\u8fdb\u884c\u5408\u7406\u5ba1\u6838\uff0c\u4f46\u65e0\u6cd5\u4fdd\u8bc1\u8bbe\u7f6e\u7684\u5916\u90e8\u94fe\u63a5\u7684\u51c6\u786e\u6027\u548c\u5b8c\u6574\u6027\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"12.\u3010\u8d23\u4efb\u9650\u989d\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"12.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u53ca\u5176\u5b50\u516c\u53f8\u3001\u63a7\u80a1\u516c\u53f8\u548c\u5176\u4ed6\u5173\u8054\u516c\u53f8\u6839\u636e\u672c\u6761\u6b3e\u89c4\u5b9a\u7684\u6240\u6709\u6848\u7531\u548c\u8d54\u507f\u8d23\u4efb\u5bf9\u60a8\u627f\u62c5\u7684\u5168\u90e8\u8d23\u4efb\uff0c\u5c06\u9650\u4e8e\u60a8\u5728\u8fc7\u53bb\u516d\u4e2a\u6708\u5185\u5c31\u4e0e\u4e89\u8bae\u6709\u5173\u7684\u8d44\u6e90\u5411\u5e73\u53f0\u7ecf\u8425\u8005\u652f\u4ed8\u7684\u91d1\u989d\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"12.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u660e\u786e\u7406\u89e3\u5e76\u540c\u610f\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u53ca\u5176\u5173\u8054\u516c\u53f8\u4e0d\u5bf9\u4ee5\u4e0b\u539f\u56e0\u9020\u6210\u7684\u635f\u5931\u8d1f\u8d23\uff1a(A)\u60a8\u5bf9\u5e7f\u544a\u5b8c\u6574\u6027\u6216\u51c6\u786e\u6027\u7684\u4f9d\u8d56\uff1b(B)\u5e73\u53f0\u5bf9\u670d\u52a1\u505a\u51fa\u7684\u4efb\u4f55\u53d8\u66f4\u6216\u505c\u6b62\uff1b(C)\u6570\u636e\u7684\u5220\u9664\u6216\u635f\u574f\uff1b\u6216(D)\u60a8\u672a\u80fd\u63d0\u4f9b\u51c6\u786e\u7684\u5e10\u6237\u4fe1\u606f\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"12.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u672c\u6761\u6b3e\u4e2d\u7684\u4efb\u4f55\u5185\u5bb9\u5747\u4e0d\u6392\u9664\u5e73\u53f0\u7ecf\u8425\u8005\u5bf9\u56e0\u758f\u5ffd\u9020\u6210\u7684\u6b7b\u4ea1\u6216\u4eba\u8eab\u4f24\u5bb3\u3001\u6b3a\u8bc8\u6027\u865a\u5047\u9648\u8ff0\u6216\u6cd5\u5f8b\u89c4\u5b9a\u4e0d\u53ef\u9650\u5236\u7684\u5176\u4ed6\u8d23\u4efb\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"13.\u3010\u4e2a\u4eba\u4fe1\u606f\u4fdd\u62a4\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"13"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u5c06\u6309\u7167\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0a\u516c\u5e03\u7684\u300a\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e2a\u4eba\u4fe1\u606f\u5904\u7406\u89c4\u5219\u300b\u6536\u96c6\u3001\u5b58\u50a8\u3001\u4f7f\u7528\u3001\u62ab\u9732\u548c\u4fdd\u62a4\u60a8\u7684\u4e2a\u4eba\u4fe1\u606f\u3002\u5982\u679c\u60a8\u662f\u672a\u6ee1\u5341\u516b\u5468\u5c81\u7684\u672a\u6210\u5e74\u4eba\uff0c\u8bf7\u901a\u77e5\u60a8\u7684\u76d1\u62a4\u4eba\u5171\u540c\u9605\u8bfb\u5e76\u786e\u8ba4\u8be5\u89c4\u5219\uff0c\u5e76\u5728\u63d0\u4ea4\u4e2a\u4eba\u4fe1\u606f\u524d\u5bfb\u6c42\u5176\u6307\u5bfc\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"14.\u3010\u5408\u540c\u53d8\u66f4\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"14.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5e73\u53f0\u7ecf\u8425\u8005\u53ef\u80fd\u4f1a\u4e0d\u65f6\u5730\u589e\u52a0\u6216\u6539\u53d8\u6761\u6b3e\u7684\u5185\u5bb9\u3002\u5f53\u8fd9\u4e9b\u53d8\u5316\u53d1\u751f\u65f6\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u5c06\u5728\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u63d0\u4f9b\u4e00\u4efd\u65b0\u7684\u6761\u6b3e\u526f\u672c\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"14.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u7406\u89e3\u5e76\u540c\u610f\uff0c\u5982\u679c\u60a8\u5728\u6761\u6b3e\u53d8\u66f4\u540e\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u548c\u8d44\u4ea7\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u5c06\u628a\u60a8\u7684\u4f7f\u7528\u89c6\u4e3a\u63a5\u53d7\u66f4\u65b0\u7684\u6761\u6b3e\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"15.\u3010\u5176\u4ed6\u6761\u6b3e\u3011"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"15.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u672c\u6761\u6b3e\u6784\u6210\u60a8\u4e0e\u5e73\u53f0\u7ecf\u8425\u8005\u4e4b\u95f4\u7684\u5b8c\u6574\u6cd5\u5f8b\u534f\u8bae\u3002\u5982\u679c\u6cd5\u9662\u5224\u5b9a\u672c\u6761\u6b3e\u4efb\u4f55\u89c4\u5b9a\u65e0\u6548\uff0c\u8be5\u89c4\u5b9a\u5c06\u88ab\u5220\u9664\uff0c\u800c\u4e0d\u5f71\u54cd\u5176\u4f59\u90e8\u5206\u7684\u6709\u6548\u6027\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"15.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8fd9\u4e9b\u6761\u6b3e\u4ee5\u53ca\u60a8\u5728\u8fd9\u4e9b\u6761\u6b3e\u4e0b\u4e0e\u5e73\u53f0\u7ecf\u8425\u8005\u7684\u5173\u7cfb\u5e94\u53d7\u4e2d\u534e\u4eba\u6c11\u5171\u548c\u56fd\u6cd5\u5f8b\u7ba1\u8f96\u3002\u56e0\u672c\u6761\u6b3e\u5f15\u8d77\u7684\u4efb\u4f55\u4e89\u8bae\u5e94\u7531\u4e0a\u6d77\u4ef2\u88c1\u59d4\u5458\u4f1a\u6839\u636e\u5176\u7b80\u6613\u4ef2\u88c1\u7a0b\u5e8f\u89c4\u5219\u8fdb\u884c\u4ef2\u88c1\u89e3\u51b3\u3002"</span>
              </div>
            </div>
          </section>
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6 text-foreground">附件1：资源商店最终用户许可协议</h2>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"\u9644\u4ef61\uff1a\u8d44\u6e90\u5546\u5e97\u6700\u7ec8\u7528\u6237\u8bb8\u53ef\u534f\u8bae"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"1.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u672c\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u6700\u7ec8\u7528\u6237\u8bb8\u53ef\u534f\u8bae\uff08\u201cEULA\u201d\uff09\u662f\u4efb\u4f55\u4ece\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u83b7\u5f97\u8d44\u6e90\u8bb8\u53ef\u7684\u4e2a\u4eba\u6216\u5355\u4e00\u5b9e\u4f53\uff08\u201c\u6700\u7ec8\u7528\u6237\u201d\uff09\u4e0e\u8bb8\u53ef\u4eba\u4e4b\u95f4\u7684\u975e\u72ec\u5bb6\u3001\u5177\u6709\u6cd5\u5f8b\u7ea6\u675f\u529b\u7684\u6700\u7ec8\u7528\u6237\u8bb8\u53ef\u534f\u8bae\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u901a\u8fc7\u5b89\u88c5\u3001\u590d\u5236\u3001\u8bbf\u95ee\u3001\u4e0b\u8f7d\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u4f7f\u7528\u8d44\u4ea7\uff0c\u6700\u7ec8\u7528\u6237\u540c\u610f\u63a5\u53d7\u672cEULA\u6761\u6b3e\u7684\u7ea6\u675f\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u672c\u534f\u8bae\u7684\u6807\u7684\u662f\u8bb8\u53ef\u4eba\u901a\u8fc7\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u5c06\u5176\u8d44\u4ea7\u8bb8\u53ef\u7ed9\u6700\u7ec8\u7528\u6237\u4f7f\u7528\u3002\u6b64\u7c7b\u8d44\u6e90\u4ec5\u4f9b\u8bb8\u53ef\u4f7f\u7528\uff0c\u800c\u975e\u51fa\u552e\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"2.\u3010\u6700\u7ec8\u7528\u6237\u7684\u6743\u5229\u548c\u4e49\u52a1\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"2.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u53ea\u80fd\u5c06\u8bb8\u53ef\u8d44\u6e90\u7528\u4e8e\u5176\u9884\u5b9a\u7528\u9014\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u975e\u53d7\u9650\u8d44\u6e90\u3002\u5728\u9075\u5b88\u672cEULA\u9650\u5236\u7684\u524d\u63d0\u4e0b\uff0c\u8bb8\u53ef\u4eba\u7279\u6b64\u6388\u4e88\u6700\u7ec8\u7528\u6237\u4e00\u9879\u975e\u72ec\u5bb6\u7684\u3001\u4e0d\u53ef\u8f6c\u8ba9\u7684\u3001\u5168\u7403\u6027\u7684\u3001\u6c38\u4e45\u7684\u8d44\u6e90\u8bb8\u53ef\uff0c\u7528\u4e8e\uff1a(a)\u5c06\u8be5\u8d44\u6e90\u8fde\u540c\u975e\u901a\u8fc7\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u83b7\u5f97\u7684\u5927\u91cf\u539f\u521b\u5185\u5bb9\uff0c\u7eb3\u5165\u7535\u5b50\u5e94\u7528\u7a0b\u5e8f\u6216\u6570\u5b57\u5a92\u4f53\uff1b(b)\u590d\u5236\u3001\u516c\u5f00\u5c55\u793a\u3001\u516c\u5f00\u8868\u6f14\u3001\u4f20\u8f93\u548c\u5206\u53d1\u88ab\u7eb3\u5165\u548c\u5d4c\u5165\u8be5\u8bb8\u53ef\u4ea7\u54c1\u4e2d\u7684\u8d44\u6e90\uff1b(c)\u5c06\u8d44\u6e90\u7eb3\u5165\u5b9e\u4f53\u5e7f\u544a\u6750\u6599\uff1b(d)\u5728\u8bb8\u53ef\u4ea7\u54c1\u5185\u53ca\u4e3a\u4e86\u8bb8\u53ef\u4ea7\u54c1\u4e4b\u4f7f\u7528\u5bf9\u8d44\u6e90\u8fdb\u884c\u8d27\u5e01\u5316\uff1b(e)\u4fee\u6539\u4e0e\u4e0a\u8ff0(a)\u3001(b)\u3001(c)\u548c(d)\u9879\u76f8\u5173\u7684\u8d44\u6e90\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2.1.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8bb8\u53ef\u9650\u5236\u3002\u6700\u7ec8\u7528\u6237\u4e0d\u5f97\u4e14\u65e0\u6743\uff1a(a)\u5206\u644a\u8d2d\u4e70\u8d44\u6e90\u7684\u8d39\u7528\u5e76\u5141\u8bb8\u4efb\u4f55\u53c2\u4e0e\u51fa\u8d44\u7684\u7b2c\u4e09\u65b9\u4f7f\u7528\u8be5\u8d44\u6e90\uff08\u5373\u201c\u8bba\u575b\u96c6\u5408\u201d\uff09\uff1b(b)\u4f7f\u8bb8\u53ef\u4ea7\u54c1\u7684\u5ba2\u6237\u6216\u7528\u6237\u80fd\u591f\u51fa\u4e8e\u5546\u4e1a\u5229\u76ca\u51fa\u552e\u3001\u8f6c\u8ba9\u3001\u5206\u53d1\u3001\u79df\u8d41\u6216\u51fa\u501f\u8d44\u6e90\uff1b(c)\u672a\u7ecf\u660e\u786e\u6388\u6743\uff0c\u5728\u8bb8\u53ef\u4ea7\u54c1\u7684\u4e3b\u8981\u76ee\u7684\u662f\u521b\u5efa\u7528\u6237\u751f\u6210\u5185\u5bb9\uff08UGC\uff09\u7684\u60c5\u51b5\u4e0b\uff0c\u5bf9\u8bb8\u53ef\u4ea7\u54c1\u4e2d\u7684\u8d44\u6e90\u8fdb\u884c\u8d27\u5e01\u5316\uff1b(d)\u9664\u672cEULA\u660e\u786e\u5141\u8bb8\u5916\uff0c\u4e0d\u5f97\u4f7f\u7528\u3001\u590d\u5236\u3001\u5206\u53d1\u3001\u8f6c\u8ba9\u3001\u8bb8\u53ef\u3001\u518d\u8bb8\u53ef\u3001\u51fa\u79df\u3001\u51fa\u501f\u3001\u51fa\u552e\u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u5c06\u4efb\u4f55\u8d44\u6e90\u5546\u4e1a\u5316\uff1b(e)\u672a\u7ecf\u660e\u786e\u6388\u6743\uff0c\u5c06\u8d44\u6e90\u7528\u4e8e\u4efb\u4f55\u4ef7\u503c\u3001\u6240\u6709\u6743\u6216\u5408\u540c\u6743\u5229\u7684\u6570\u5b57\u8868\u793a\uff08\u5982NFT\uff09\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u53d7\u9650\u8d44\u6e90\u3002\u53d7\u9650\u8d44\u6e90\u7684\u8bb8\u53ef\u6761\u6b3e\u4e0e\u666e\u901a\u8d44\u6e90\u4e0d\u540c\uff0c\u89c1\u4e8e\u968f\u9644\u6750\u6599\uff08\u201c\u53d7\u9650\u8d44\u6e90\u6761\u6b3e\u201d\uff09\u3002\u82e5\u53d7\u9650\u8d44\u6e90\u6761\u6b3e\u4e0e\u672cEULA\u4e0d\u4e00\u81f4\uff0c\u5219\u4ee5\u53d7\u9650\u8d44\u6e90\u6761\u6b3e\u4e3a\u51c6\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.3.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u9664\u6269\u5c55\u8d44\u6e90\u5916\uff0c\u6700\u7ec8\u7528\u6237\u88ab\u6388\u4e88\u5728\u65e0\u9650\u6570\u91cf\u7684\u8ba1\u7b97\u673a\u4e0a\u5b89\u88c5\u548c\u4f7f\u7528\u8d44\u6e90\u7684\u8bb8\u53ef\uff0c\u524d\u63d0\u662f\u8fd9\u4e9b\u8ba1\u7b97\u673a\u5c5e\u4e8e\u6700\u7ec8\u7528\u6237\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.3.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u88ab\u6388\u4e88\u201c\u5355\u5e2d\u4f4d\u201d\u8bb8\u53ef\uff0c\u7528\u4e8e\u5728\u6700\u591a\u4e24\u53f0\u8ba1\u7b97\u673a\u4e0a\u5b89\u88c5\u548c\u4f7f\u7528\u8d44\u6e90\u5546\u5e97\u4e2d\u88ab\u5f52\u7c7b\u4e3a\u201c\u7f16\u8f91\u6269\u5c55\u201d\u3001\u201c\u811a\u672c\u201d\u6216\u201c\u670d\u52a1\u201d\u7684\u4efb\u4f55\u8d44\u6e90\uff08\u7edf\u79f0\u201c\u6269\u5c55\u8d44\u6e90\u201d\uff09\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u53ef\u4ee5\u6309\u7167\u7b2c2.2\u548c2.3\u6761\u4f7f\u7528\u8d44\u6e90\uff0c\u5e76\u53ef\u8058\u8bf7\u7b2c\u4e09\u65b9\u627f\u5305\u5546\u4ee3\u8868\u5176\u5904\u7406\u8d44\u6e90\u3002\u4f46\u9664\u975e\u662f\u7b2c2.3.1\u6761\u89c4\u5b9a\u7684\u201c\u591a\u5b9e\u4f53\u201d\u8d44\u6e90\uff0c\u5426\u5219\u4e3a\u6700\u7ec8\u7528\u6237\u5de5\u4f5c\u7684\u627f\u5305\u5546\u5fc5\u987b\u62e5\u6709\u5176\u72ec\u7acb\u7684\u8d44\u6e90\u8bb8\u53ef\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.5"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u5e94\u6309\u7167\u8d44\u6e90\u5546\u5e97\u7684\u6d41\u7a0b\u652f\u4ed8\u8bb8\u53ef\u8d39\u3002\u6700\u7ec8\u7528\u6237\u5e94\u63d0\u4f9b\u51c6\u786e\u7684\u5e10\u5355\u548c\u7a0e\u52a1\u4fe1\u606f\uff08\u5982\u59d3\u540d\u3001\u5730\u5740\u3001\u589e\u503c\u7a0e\u53f7\uff09\u3002\u589e\u503c\u7a0e\u53f7\u5728\u8d2d\u4e70\u5b8c\u6210\u540e\u4e0d\u5f97\u66f4\u6539\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.6"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8d44\u6e90\u7684\u67d0\u4e9b\u7ec4\u4ef6\u53ef\u80fd\u53d7\u5f00\u6e90\u8f6f\u4ef6\u8bb8\u53ef\u8bc1\u7ea6\u675f\u3002\u82e5\u672cEULA\u4e0e\u6b64\u7c7b\u5f00\u6e90\u8bb8\u53ef\u8bc1\u53d1\u751f\u51b2\u7a81\uff0c\u5219\u5c31\u8be5\u7279\u5b9a\u7ec4\u4ef6\u800c\u8a00\uff0c\u4ee5\u5f00\u6e90\u8bb8\u53ef\u8bc1\u4e3a\u51c6\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.7"</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u540c\u610f\uff0c\u5bf9\u8d44\u6e90\u7684\u4efb\u4f55\u4fee\u6539\u6216\u4f7f\u7528\u5747\u4e0d\u5f97\uff1a(a)\u4fb5\u72af\u7b2c\u4e09\u65b9\u7684\u4e13\u5229\u3001\u7248\u6743\u3001\u5546\u6807\u3001\u5546\u4e1a\u79d8\u5bc6\u7b49\u77e5\u8bc6\u4ea7\u6743\uff1b(b)\u8fdd\u53cd\u6cd5\u5f8b\u6cd5\u89c4\uff1b(c)\u5305\u542b\u6b3a\u8bc8\u3001\u865a\u5047\u6216\u8bef\u5bfc\u6027\u4fe1\u606f\uff1b(d)\u5177\u6709\u8bfd\u8c24\u3001\u6deb\u79fd\u3001\u8272\u60c5\u6216\u653b\u51fb\u6027\uff1b(e)\u5ba3\u626c\u6b67\u89c6\u3001\u504f\u6267\u3001\u79cd\u65cf\u4e3b\u4e49\u3001\u4ec7\u6068\u6216\u9a9a\u6270\uff1b(f)\u5ba3\u626c\u66b4\u529b\u6216\u5a01\u80c1\uff1b\u6216(g)\u5ba3\u626c\u975e\u6cd5\u6d3b\u52a8\u6216\u6709\u5bb3\u7269\u8d28\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u9664\u975e\u672c\u534f\u8bae\u660e\u786e\u89c4\u5b9a\u6216\u6cd5\u5f8b\u5f3a\u5236\u8981\u6c42\uff0c\u6240\u6709\u9500\u552e\u5747\u4e3a\u7ec8\u5c40\uff0c\u4e0d\u4e88\u9000\u6b3e\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8d44\u6e90\u5728\u63a5\u53d7\u8ba2\u5355\u540e\u5373\u53ef\u7acb\u5373\u4e0b\u8f7d\uff0c\u56e0\u6b64\u6700\u7ec8\u7528\u6237\u7684\u64a4\u56de\u6743\uff08\u51b7\u9759\u671f\u6743\u5229\uff09\u5728\u63a5\u53d7\u8ba2\u5355\u540e\u5373\u544a\u4e27\u5931\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6b64\u5916\uff0c\u6700\u7ec8\u7528\u6237\u5728\u8d2d\u4e70\u540e\u7684\u4efb\u4f55\u9000\u6b3e\u8bf7\u6c42\u7531\u5e73\u53f0\u7ecf\u8425\u8005\u5168\u6743\u914c\u60c5\u51b3\u5b9a\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6240\u6709\u7b26\u5408\u7b2c2.9.3\u6761\u7684\u9000\u6b3e\u5747\u9700\u7ecf\u8fc7\u4eba\u5de5\u5ba1\u6838\uff0c\u4ee5\u8bc4\u4f30\u5176\u9000\u6b3e\u53ef\u884c\u6027\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.9"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5728\u672cEULA\u4e2d\uff0c\u201c\u53d7\u9650\u8d44\u6e90\u201d\u6307\u7ecf\u5e73\u53f0\u7ecf\u8425\u8005\u4e8b\u5148\u4e66\u9762\u6279\u51c6\uff0c\u5e76\u5728\u968f\u9644\u6750\u6599\u4e2d\u88ab\u660e\u786e\u6807\u6ce8\u4e3a\u201c\u53d7\u9650\u8d44\u6e90\u201d\u7684\u4efb\u4f55\u8d44\u6e90\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"3.\u3010\u8bb8\u53ef\u4eba\u7684\u6743\u5229\u548c\u4e49\u52a1\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8bb8\u53ef\u4eba\u4ec5\u5728\u53cc\u65b9\u7b7e\u8ba2\u7279\u522b\u534f\u8bae\u7684\u60c5\u51b5\u4e0b\uff0c\u624d\u4f1a\u5411\u6700\u7ec8\u7528\u6237\u63d0\u4f9b\u652f\u6301\u670d\u52a1\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"4.\u3010\u7ec8\u6b62\u6761\u6b3e\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"4.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5982\u679c\u6700\u7ec8\u7528\u6237\u672a\u80fd\u9075\u5b88\u672cEULA\u6216\u4e3b\u534f\u8bae\u6761\u6b3e\uff0c\u8bb8\u53ef\u4eba\u53ef\u5728\u4e0d\u635f\u5bb3\u5176\u4ed6\u6743\u5229\u7684\u60c5\u51b5\u4e0b\u7ec8\u6b62\u672c\u534f\u8bae\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u53ef\u968f\u65f6\u7ec8\u6b62\u5176\u8bb8\u53ef\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u82e5\u5e73\u53f0\u7ecf\u8425\u8005\u6839\u636e\u81ea\u8eab\u5224\u65ad\u6216\u6cd5\u9662\u88c1\u51b3\u5411\u6700\u7ec8\u7528\u6237\u9000\u8fd8\u4e86\u8d44\u6e90\u8d39\u7528\uff0c\u5219\u672cEULA\u5bf9\u8be5\u8d44\u6e90\u7684\u6388\u6743\u81ea\u52a8\u7ec8\u6b62\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.4"</span>
                <span className="text-muted-foreground leading-relaxed">"\u672c\u534f\u8bae\u7ec8\u6b62\u540e\uff0c\u6b64\u5904\u6388\u4e88\u7684\u6240\u6709\u6743\u5229\u5373\u523b\u5931\u6548\uff0c\u6700\u7ec8\u7528\u6237\u5e94\u7acb\u5373\u9500\u6bc1\u5176\u63a7\u5236\u4e0b\u7684\u6240\u6709\u8d44\u6e90\u526f\u672c\uff0c\u5e76\u5411\u8bb8\u53ef\u4eba\u63d0\u4f9b\u4e66\u9762\u9500\u6bc1\u786e\u8ba4\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"5.\u3010\u590d\u5236\u6743/\u5907\u4efd\u526f\u672c\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"5.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u4e0d\u5f97\u5bf9\u8d44\u6e90\u8fdb\u884c\u590d\u5236\uff0c\u9664\u975e\u662f\u5fc5\u8981\u7684\u4e34\u65f6\u7f13\u5b58\u590d\u5236\uff0c\u6216\u5728\u9002\u7528\u6cd5\u5f8b\u5f3a\u5236\u6027\u89c4\u5b9a\u7684\u5141\u8bb8\u8303\u56f4\u5185\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u5728\u5b89\u88c5\u4e00\u4e2a\u526f\u672c\u540e\uff0c\u6700\u7ec8\u7528\u6237\u53ef\u4ee5\u4fdd\u7559\u4e00\u4efd\u539f\u59cb\u8d44\u6e90\u526f\u672c\uff0c\u4f46\u4ec5\u80fd\u7528\u4e8e\u5907\u4efd\u6216\u5b58\u6863\u76ee\u7684\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"6.\u3010\u9006\u5411\u5de5\u7a0b\u3001\u53cd\u7f16\u8bd1\u548c\u53cd\u6c47\u7f16\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"6"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u53ef\u4ee5\u4fee\u6539\u8d44\u6e90\u3002\u6700\u7ec8\u7528\u6237\u4e0d\u5f97\u5bf9\u670d\u52a1SDK\u8fdb\u884c\u9006\u5411\u5de5\u7a0b\u3001\u53cd\u7f16\u8bd1\u6216\u53cd\u6c47\u7f16\uff0c\u9664\u975e\u4e14\u4ec5\u5728\u5f3a\u5236\u6027\u6cd5\u5b9a\u9002\u7528\u6cd5\u5f8b\u660e\u786e\u5141\u8bb8\u7684\u8303\u56f4\u5185\u8fdb\u884c\u6b64\u7c7b\u6d3b\u52a8\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"7.\u3010\u5546\u6807\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"7"</span>
                <span className="text-muted-foreground leading-relaxed">"\u672c\u534f\u8bae\u4e66\u4e0d\u6388\u4e88\u6700\u7ec8\u7528\u6237\u4e0e\u8bb8\u53ef\u4eba\u3001\u4f9b\u5e94\u5546\u6216\u8bb8\u53ef\u4eba\u7684\u5176\u4ed6\u4f9b\u5e94\u5546\u7684\u4efb\u4f55\u5546\u6807\u6216\u670d\u52a1\u6807\u5fd7\u6709\u5173\u7684\u4efb\u4f55\u6743\u5229\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"8.\u3010\u5347\u7ea7\u548c\u652f\u6301\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"8.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u88ab\u786e\u5b9a\u4e3a\u5347\u7ea7\u7684\u8d44\u6e90\u53d6\u4ee3\u548c/\u6216\u8865\u5145\u88ab\u8bb8\u53ef\u7684\u8d44\u6e90\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"8.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8bb8\u53ef\u4eba\u53ef\u4ee5\u81ea\u884c\u51b3\u5b9a\u4e0d\u65f6\u5411\u6700\u7ec8\u7528\u6237\u63d0\u4f9b\u8d44\u6e90\u7684\u5347\u7ea7\uff0c\u800c\u4e0d\u8981\u6c42\u8fdb\u4e00\u6b65\u4ed8\u6b3e\u3002\u6700\u7ec8\u7528\u6237\u53ea\u80fd\u6309\u7167\u672c\u534f\u8bae\u7684\u6761\u6b3e\u4f7f\u7528\u5347\u7ea7\u540e\u7684\u8d44\u6e90\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"8.3"</span>
                <span className="text-muted-foreground leading-relaxed">"\u53ea\u6709\u5f53\u6700\u7ec8\u7528\u6237\u4e0e\u8bb8\u53ef\u4eba\u7b7e\u8ba2\u4e86\u652f\u6301\u534f\u8bae\uff0c\u6700\u7ec8\u7528\u6237\u624d\u6709\u6743\u83b7\u5f97\u652f\u6301\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"9.\u3010\u77e5\u8bc6\u4ea7\u6743\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"9.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8fd9\u4e9b\u8d44\u6e90\u53d7\u5230\u8457\u4f5c\u6743\u6cd5\u548c\u56fd\u9645\u7248\u6743\u6761\u7ea6\u4ee5\u53ca\u5176\u4ed6\u77e5\u8bc6\u4ea7\u6743\u6cd5\u548c\u6761\u7ea6\u7684\u4fdd\u62a4\u3002"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"9.2"</span>
                <span className="text-muted-foreground leading-relaxed">"\u8d44\u6e90\uff08\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\u4efb\u4f55\u8f6f\u4ef6\u3001\u56fe\u50cf\u3001\u7167\u7247\u3001\u52a8\u753b\u3001\u56fe\u5f62\u3001\u4e09\u7ef4\u56fe\u5f62\u3001\u89c6\u9891\u3001\u97f3\u9891\u3001\u97f3\u4e50\u3001\u6587\u672c\u3001\u6559\u7a0b\u548c\u7eb3\u5165\u8d44\u6e90\u7684\u5c0f\u7a0b\u5e8f\uff09\u3001\u9644\u5e26\u7684\u5370\u5237\u6750\u6599\u548c\u8d44\u4ea7\u7684\u4efb\u4f55\u526f\u672c\u7684\u6240\u6709\u6240\u6709\u6743\u548c\u77e5\u8bc6\u4ea7\u6743\u90fd\u5c5e\u4e8e\u8bb8\u53ef\u4eba\u3002\u6240\u6709\u672a\u660e\u786e\u6388\u4e88\u7684\u6743\u5229\u5747\u7531\u8bb8\u53ef\u4eba\u4fdd\u7559\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"10.\u3010\u514d\u8d23\u58f0\u660e\u3011"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"10.1"</span>
                <span className="text-muted-foreground leading-relaxed">"\u6700\u7ec8\u7528\u6237\u7406\u89e3\u5e76\u63a5\u53d7\uff0c\u5728\u5c06\u4efb\u4f55\u8d44\u6e90\u653e\u7f6e\u5728\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0a\u4e4b\u524d\uff0c\u5e73\u53f0\u7ecf\u8425\u8005\u53ef\u80fd\u4f1a\u76d1\u63a7\u3001\u9884\u5148\u7b5b\u9009\u3001\u5ba1\u67e5\u3001\u6807\u8bb0\u3001\u8fc7\u6ee4\u3001\u4fee\u6539\u3001\u62d2\u7edd\u6216\u4ece\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u4e0a\u5220\u9664\u4efb\u4f55\u8d44\u6e90\u6216\u5176\u5185\u5bb9\uff0c\u4f46\u5e76\u4e0d\u4fdd\u8bc1\u6240\u6709\u8d44\u6e90\u7684\u5408\u89c4\u6027\u3002\u6700\u7ec8\u7528\u6237\u660e\u786e\u7406\u89e3\u5e76\u540c\u610f\uff0c\u5176\u4f7f\u7528\u8d44\u6e90\u7684\u98ce\u9669\u7531\u6700\u7ec8\u7528\u6237\u81ea\u884c\u627f\u62c5\uff0c\u5e76\u4e14\u8d44\u6e90\u662f\u6309\u539f\u6837\u548c\u53ef\u7528\u63d0\u4f9b\u7684\uff0c\u5728\u9002\u7528\u6cd5\u5f8b\u5141\u8bb8\u7684\u6700\u5927\u8303\u56f4\u5185\u6ca1\u6709\u4efb\u4f55\u5f62\u5f0f\u7684\u4fdd\u8bc1\u3002"</span>
              </div>
            </div>
          </section>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"1. Scope of Agreement"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"1.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The GENJI Asset Store is owned and operated by Vario Trade & Investment Ltd. and its affiliates (the \"Platform Operator\"). Your use of the GENJI Asset Store is governed by these Terms. In this Agreement, any reference to \"GENJI Asset Store\" shall be deemed to refer collectively to \"GENJI Asset Store\" and \"GENJI Studio\"."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.2"</span>
                <span className="text-muted-foreground leading-relaxed">"In addition, you obtain a license from the GENJI Asset Store provided by the Platform Operator. All such licenses are subject to the standard GENJI Asset Store End User License Agreement (\"EULA\"), attached as Appendix 1."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.3"</span>
                <span className="text-muted-foreground leading-relaxed">"You may use the GENJI Asset Store to browse, locate, and download Assets. Assets are defined as: (i) 2D or 3D files that contain graphic elements, props, humanoid traits, or functional features; and (ii) 3D avatars ready for use within GENJI Studio or available for export."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.4"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator reserves the right to adjust or supplement this Agreement. Your continued use of the Service following any such changes constitutes your acceptance of the adjustments or supplements."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"2. Provision of the GENJI Asset Store"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"2.1"</span>
                <span className="text-muted-foreground leading-relaxed">"You agree that the Platform Operator may, at its sole discretion and without prior notice, permanently or temporarily cease providing the GENJI Asset Store (or any specific features within the store) to you or to users in general."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator may integrate third-party payment services to facilitate Asset purchases. You agree that the Platform Operator reserves the right to add or remove payment methods at its sole discretion without notice to you."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.3"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator may periodically identify Assets that violate applicable agreements, laws, regulations, or policies. You agree that the Platform Operator retains the right to demand the removal of such Assets from any device under your control."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.4"</span>
                <span className="text-muted-foreground leading-relaxed">"You acknowledge and agree that the Platform Operator reserves the right, at its sole discretion and upon prior notice, to modify the business model of GENJI Studio and the GENJI Asset Store (including, without limitation, payment modes, asset ownership structures, and subscription frameworks)."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"3. Account Registration and Usage"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"3.1"</span>
                <span className="text-muted-foreground leading-relaxed">"You may be required to register an account to use the GENJI Asset Store. The right of use belongs exclusively to the initial registrant. You are prohibited from gifting, lending, renting, transferring, selling, or otherwise licensing the account to others."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.2"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator has the right to require users to complete real-name authentication. If the information provided is inaccurate or non-compliant, the Platform Operator reserves the right to refuse service."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.3"</span>
                <span className="text-muted-foreground leading-relaxed">"You agree not to access (or attempt to access) the GENJI Asset Store through any means other than the interface provided by the Platform Operator, unless specifically authorized in a separate written agreement."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.4"</span>
                <span className="text-muted-foreground leading-relaxed">"You agree not to engage in any activity that interferes with or disrupts the GENJI Asset Store, its connected servers, payment systems, or networks."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.5"</span>
                <span className="text-muted-foreground leading-relaxed">"Unless expressly permitted in a separate agreement or under the EULA, you agree not to reproduce, distribute, transfer, license, sublicense, rent, lease, lend, sell, trade, resell, or otherwise commercialize any Assets licensed from the GENJI Asset Store or GENJI Studio."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.6"</span>
                <span className="text-muted-foreground leading-relaxed">"You agree that you are solely responsible for your use of the GENJI Asset Store and its Assets, and for any breach of your obligations under these Terms."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"3.7"</span>
                <span className="text-muted-foreground leading-relaxed">"You understand and agree that the Assets on this platform are digital products and are not eligible for the \"seven-day no-reason return\" policy."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"4. Intellectual Property"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"4.1"</span>
                <span className="text-muted-foreground leading-relaxed">"You acknowledge that the Platform Operator and/or relevant third parties hold all right, title, and interest in the GENJI Asset Store and its Assets, including all applicable Intellectual Property Rights. You agree that you will not, nor allow any third party to: (i) decompile, reverse engineer, or disassemble the Service; (ii) circumvent security features; (iii) use the Service in violation of any law or third-party rights; or (iv) remove or alter any copyright notices or trademarks."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.2"</span>
                <span className="text-muted-foreground leading-relaxed">"All rights to the GENJI logos and trademarks utilized within the GENJI Asset Store are the exclusive property of Vario Trade & Investment Limited."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"5. Infringement Reporting and Complaints"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"5.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The GENJI Asset Store respects the intellectual property rights of all users. If content published by a user infringes upon the rights of a third party, the GENJI Asset Store reserves the right to take action in accordance with applicable laws."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.2"</span>
                <span className="text-muted-foreground leading-relaxed">"If the GENJI Asset Store discovers or receives a report regarding a violation of this Agreement, it reserves the right to review the allegedly infringing content and take measures such as deleting, blocking, or disconnecting the infringing content."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.3"</span>
                <span className="text-muted-foreground leading-relaxed">"If a rights holder identifies content that infringes upon their legal rights, they may file a formal complaint with the GENJI Asset Store. Complaint Email: assetstore-support@unity.cn"</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.4"</span>
                <span className="text-muted-foreground leading-relaxed">"The GENJI Asset Store reserves the right to monitor and review user activity. Should any violation occur, the GENJI Asset Store may require the user to rectify the situation or directly take necessary measures."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.5"</span>
                <span className="text-muted-foreground leading-relaxed">"In the event a third party infringes upon the rights of a GENJI Asset Store user, the user authorizes the GENJI Asset Store or its designated agents to independently monitor, warn, complain, initiate administrative enforcement, litigate, appeal, or settle with said third party."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"6. User Code of Conduct"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"6.1"</span>
                <span className="text-muted-foreground leading-relaxed">"You understand and agree that the GENJI Asset Store is dedicated to maintaining a civilized and orderly network environment. You are prohibited from copying, publishing, or distributing any content that interferes with the operations of the GENJI Asset Store or violates the rights of others, including but not limited to: content prohibited by national laws; content that infringes intellectual property rights; content disclosing the private information of others; harassment, spam, or sexually suggestive content; and any other content that violates laws, policies, or public order."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"7. Platform Operator Services and Third-Party Assets"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"7.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Certain components of the Assets may be subject to third-party software licenses. In the event of a conflict between this Agreement and such licenses, the third-party license shall prevail specifically regarding those components."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"8. Automatic Updates"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"8.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Assets provided by the Platform Operator and Providers may periodically communicate with servers to check for available updates, including bug fixes, patches, enhanced functions, and new versions (collectively, \"Updates\"). By installing these Assets, you consent to such automatically requested and received Updates."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"9. Indemnification"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"9.1"</span>
                <span className="text-muted-foreground leading-relaxed">"To the maximum extent permitted by law, you agree to defend, indemnify, and hold harmless the Platform Operator, its affiliates, and their respective directors, officers, employees, and agents from and against any and all claims, actions, suits, or proceedings, as well as all losses, liabilities, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to your use of the GENJI Asset Store or your violation of these Terms."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"10. Termination"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"10.1"</span>
                <span className="text-muted-foreground leading-relaxed">"These Terms shall remain in effect until terminated by either you or the Platform Operator as set forth below."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"10.2"</span>
                <span className="text-muted-foreground leading-relaxed">"You may terminate these Terms at any time by ceasing all use of the GENJI Asset Store and any Assets downloaded therefrom."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"10.3"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator may terminate these Terms with you at any time if: (a) you breach any provision of these Terms; (b) the Platform Operator is required to do so by law; or (c) the Platform Operator elects to cease providing the GENJI Asset Store."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"10.4"</span>
                <span className="text-muted-foreground leading-relaxed">"Upon termination, all legal rights, obligations, and liabilities that have accrued during the term of this Agreement shall remain unaffected."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"11. Disclaimer of Warranties"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"11.1"</span>
                <span className="text-muted-foreground leading-relaxed">"You expressly acknowledge and agree that your use of the GENJI Asset Store and any Assets obtained through it is at your sole risk. The Service and Assets are provided on an \"as is\" and \"as available\" basis without warranties of any kind, to the maximum extent permitted by law."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.2"</span>
                <span className="text-muted-foreground leading-relaxed">"Any Assets downloaded or otherwise obtained through the GENJI Asset Store are accessed at your own discretion and risk. You are solely responsible for any damage to your computer system, devices, or loss of data resulting from such use."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.3"</span>
                <span className="text-muted-foreground leading-relaxed">"To the maximum extent permitted by applicable law, the Platform Operator expressly disclaims all warranties and conditions of any kind, whether express or implied, including but not limited to implied warranties of merchantability, satisfactory quality, fitness for a particular purpose, and non-infringement."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.4"</span>
                <span className="text-muted-foreground leading-relaxed">"No Assets are intended for use in high-risk activities such as the operation of nuclear facilities, life support systems, emergency communications, or air traffic control."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"11.5"</span>
                <span className="text-muted-foreground leading-relaxed">"The GENJI Asset Store will conduct reasonable reviews of products, services, and advertisements on its website as required by law, but cannot guarantee the accuracy or completeness of external links."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"12. Limitation of Liability"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"12.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The total aggregate liability of the Platform Operator and its affiliates for all claims arising under these Terms shall be limited to the amount you paid to the Platform Operator for the Assets related to the dispute during the six months preceding the claim."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"12.2"</span>
                <span className="text-muted-foreground leading-relaxed">"You expressly agree that the Platform Operator and its affiliates shall not be liable for losses resulting from: (A) your reliance on any advertising; (B) changes or cessation of the Service; (C) deletion or corruption of stored data; or (D) your failure to provide accurate account information."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"12.3"</span>
                <span className="text-muted-foreground leading-relaxed">"Nothing in these Terms excludes liability for death or personal injury caused by negligence, fraudulent misrepresentation, or any other liability that cannot be limited under applicable law."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"13. Personal Information Protection"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"13"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator will collect, process, and protect your personal information in accordance with the GENJI Asset Store Personal Information Processing Rules. If you are a minor under the age of 18, please ensure your guardian reviews these rules and provides consent before you submit any personal information."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"14. Change of Terms"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"14.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The Platform Operator may update these Terms from time to time. When changes are made, a new version will be made available on the GENJI Asset Store."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"14.2"</span>
                <span className="text-muted-foreground leading-relaxed">"Your continued use of the Service or Assets after the date of such changes constitutes your acceptance of the updated Terms."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">"15. Miscellaneous"</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"15.1"</span>
                <span className="text-muted-foreground leading-relaxed">"These Terms constitute the entire agreement between you and the Platform Operator. If any provision is found invalid by a court of law, that provision shall be severed without affecting the validity of the remaining Terms."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"15.2"</span>
                <span className="text-muted-foreground leading-relaxed">"These Terms and your relationship with the Platform Operator shall be governed by the laws of the People's Republic of China. Any dispute arising from these Terms shall be settled by simplified arbitration through the Shanghai Arbitration Commission."</span>
              </div>
            </div>
          </section>
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Appendix 1: Asset Store End User License Agreement</h2>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"Appendix 1: Asset Store End User License Agreement"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"1.1"</span>
                <span className="text-muted-foreground leading-relaxed">"This GENJI Asset Store End User License Agreement (\"EULA\") is a non-exclusive, legally binding agreement between any individual or legal entity (\"END-USER\") that acquires a license to an Asset from the GENJI Asset Store and the Licensor."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.2"</span>
                <span className="text-muted-foreground leading-relaxed">"By installing, copying, accessing, downloading, or otherwise using the Assets, the END-USER agrees to be bound by the terms of this EULA."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"1.3"</span>
                <span className="text-muted-foreground leading-relaxed">"The subject matter of this EULA is the licensing of Assets from the Licensor to the END-USER via the GENJI Asset Store. These Assets are licensed to you, not sold."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"2. END-USER's Rights and Obligations"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"2.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER may use the licensed Assets only for their intended purposes."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Non-Restricted Assets. Subject to the restrictions in this EULA, the Licensor hereby grants the END-USER a non-exclusive, non-transferable, worldwide, and perpetual license to the Asset solely to: (a) Incorporate the Asset into an electronic application or digital media; (b) Reproduce, publicly display, publicly perform, transmit, and distribute the Asset as incorporated into such Licensed Product; (c) Incorporate the Asset into physical advertising materials for marketing purposes; (d) Monetize the Asset within a Licensed Product; and (e) Modify the Assets in connection with the above."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2.1.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Limitations on License. The END-USER may not: (a) Share the costs of purchasing an Asset and allow third parties to use it; (b) Enable customers to sell, transfer, distribute, lease, or lend the Assets for commercial gain; (c) Without express authorization, monetize an Asset within a Licensed Product where the primary purpose is user-generated content; (d) Use, reproduce, distribute, transfer, license, sublicense, rent, lease, lend, sell, trade, resell, or otherwise commercialize any Asset except as expressly permitted; (e) Without express authorization, use Assets in any digital representation of value, ownership, or contractual rights (e.g., NFTs)."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.2.2"</span>
                <span className="text-muted-foreground leading-relaxed">"Restricted Assets. Restricted Assets are subject to license terms that differ from other Assets, which are located in the materials accompanying the Asset (\"Restricted Asset Terms\"). Restricted Asset Terms shall prevail in the event of a conflict with this EULA."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.3.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Except for Extension Assets, the END-USER is granted a license to install and use Assets on an unlimited number of computers, provided such computers belong to the END-USER."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.3.2"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER is granted a single-seat license to install and use any Asset categorized as an \"Editor Extension,\" \"Scripting,\" or \"Services\" (collectively, \"Extension Assets\") on a maximum of two computers."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.4"</span>
                <span className="text-muted-foreground leading-relaxed">"An END-USER may use an Asset and may have a third-party Contractor work on the Asset on their behalf. However, except for multi-entity Assets, any Contractor working on a project for an END-USER must possess their own license to the Asset."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.5"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER shall pay for the Asset license in accordance with the payment process indicated by the Asset Store. The END-USER must provide accurate billing and tax information. VAT numbers cannot be modified after purchase."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.6"</span>
                <span className="text-muted-foreground leading-relaxed">"Certain components of Assets may be governed by open-source software licenses. In the event of a conflict between this EULA and such licenses, the open-source license shall prevail regarding those specific components."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.7"</span>
                <span className="text-muted-foreground leading-relaxed">"You agree that no modification or use of the Assets shall: (a) infringe intellectual property rights; (b) violate any applicable law; (c) be fraudulent, false, or misleading; (d) be defamatory, obscene, pornographic, vulgar, or offensive; (e) promote discrimination, bigotry, racism, hatred, or harassment; (f) promote violence or threatening actions; or (g) promote illegal or harmful activities."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.1"</span>
                <span className="text-muted-foreground leading-relaxed">"All sales are final. No refunds shall be issued except as expressly provided in this EULA or as required by mandatory law."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.2"</span>
                <span className="text-muted-foreground leading-relaxed">"Assets are made available for download immediately upon acceptance of an order; therefore, the END-USER's right of withdrawal is forfeited upon such acceptance."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.3"</span>
                <span className="text-muted-foreground leading-relaxed">"Any refund requests made after purchase are subject to the sole discretion of the Platform Operator."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.8.4"</span>
                <span className="text-muted-foreground leading-relaxed">"Refunds under Section 2.8.3 are subject to a manual review by the Platform Operator to determine eligibility."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"2.9"</span>
                <span className="text-muted-foreground leading-relaxed">"In this EULA, \"Restricted Asset\" refers to any Asset that is designated as such in its accompanying materials, subject to prior written approval from the Platform Operator."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"3. Licensor's Rights and Obligations"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"3"</span>
                <span className="text-muted-foreground leading-relaxed">"The Licensor shall provide support services to the END-USER only if a specific separate agreement for such services has been executed."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"4. Termination"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"4.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Without prejudice to any other rights, the Licensor may terminate this EULA if the END-USER fails to comply with the terms and conditions of this EULA or the main Terms of Service."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.2"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER may terminate their license at any time."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.3"</span>
                <span className="text-muted-foreground leading-relaxed">"If the Platform Operator issues a refund for an Asset, this EULA shall terminate automatically regarding that specific Asset."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"4.4"</span>
                <span className="text-muted-foreground leading-relaxed">"Upon termination of this EULA, all license rights granted herein shall cease. The END-USER must immediately destroy all copies of the Assets in their possession or control."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"5. Duplication Rights and Backup Copies"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"5.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER may not make copies of the Assets, except for incidental or temporary copies or as expressly permitted under mandatory statutory law."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"5.2"</span>
                <span className="text-muted-foreground leading-relaxed">"Following the installation of one copy of the Asset, the END-USER may retain the original copy solely for backup or archival purposes."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"6. Reverse Engineering, Decompilation, and Disassembly"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"6"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER is permitted to modify Assets. However, the END-USER shall not reverse engineer, decompile, or disassemble any Services SDKs, except and only to the extent that such activity is expressly permitted by mandatory statutory law."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"7. Trademarks"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"7"</span>
                <span className="text-muted-foreground leading-relaxed">"This EULA does not grant the END-USER any rights, titles, or interests in or to any trademarks or service marks of the Licensor, Provider, or the Licensor's other suppliers."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"8. Upgrades and Support"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"8.1"</span>
                <span className="text-muted-foreground leading-relaxed">"Assets identified as Upgrades shall replace and/or supplement the originally licensed Assets."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"8.2"</span>
                <span className="text-muted-foreground leading-relaxed">"The Licensor may, at its sole discretion, provide Upgrades to the END-USER without additional charge. Any Upgraded Assets must be used in strict accordance with the terms of this EULA."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"8.3"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER is only entitled to technical support if they have entered into a separate Support Agreement with the Licensor."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"9. Intellectual Property"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"9.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The Assets are protected by the copyright laws of the PRC, international copyright treaties, and other applicable intellectual property laws."</span>
              </div>
              <div>
                <span className="font-semibold text-foreground mr-1">"9.2"</span>
                <span className="text-muted-foreground leading-relaxed">"All title and intellectual property rights in and to the Assets (including but not limited to software, images, animations, 3D graphics, audio, and applets incorporated therein), accompanying printed materials, and any copies thereof are owned exclusively by the Licensor. All rights not expressly granted are reserved."</span>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-foreground">"10. Disclaimer of Warranties"</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-foreground mr-1">"10.1"</span>
                <span className="text-muted-foreground leading-relaxed">"The END-USER acknowledges that while the Platform Operator may screen, monitor, or remove Assets from the GENJI Asset Store, it does not guarantee the legal compliance of all Assets. Use of Assets is at the END-USER's own risk; Assets are provided on an \"as is\" and \"as available\" basis without warranties of any kind."</span>
              </div>
            </div>
          </section>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t text-sm text-muted-foreground">
            <p>{isZh ? "如有疑问，请联系：assetstore-support@unity.cn" : "For questions, please contact: assetstore-support@unity.cn"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
