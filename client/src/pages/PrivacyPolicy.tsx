import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
              {isZh ? "亘吉资源商店个人信息处理规则" : "GENJI Asset Store Personal Information Processing Rules"}
            </h1>
          </div>

          <div className="space-y-2 mb-8 text-sm leading-relaxed text-muted-foreground">
            {isZh ? (
              <>
                <p>亘吉资源商店由威而森（上海）贸易有限公司及其关联实体（统称为"我们"）运营。本《个人信息处理规则》（以下简称"本政策"）适用于亘吉资源商店及相关软件产品，包括 GENJI Studio。</p>
                <p>我们充分理解个人信息保护的重要性，并致力于根据中华人民共和国（下称"中国"）相关法律法规保护您的合法权益。</p>
                <p>在使用我们的服务之前，请仔细阅读本政策。</p>
              </>
            ) : (
              <>
                <p>GENJI Asset Store is operated by Vario Trade & Investment Ltd. and its affiliated entities (collectively "we", "us", or "our"). These Personal Information Processing Rules ("Policy") apply to GENJI Asset Store and related software products, including GENJI Studio.</p>
                <p>We fully understand the importance of personal information protection and are committed to safeguarding your lawful rights and interests in accordance with applicable laws and regulations of the People's Republic of China ("PRC").</p>
                <p>Please read this Policy carefully before using our services.</p>
              </>
            )}
          </div>

          {isZh ? (
            <div className="space-y-2">
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u4e00\u3001\u6211\u4eec\u5982\u4f55\u6536\u96c6\u548c\u4f7f\u7528\u60a8\u7684\u4e2a\u4eba\u4fe1\u606f"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u5f53\u60a8\u4f7f\u7528\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u548c GENJI Studio \u65f6\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\u60a8\u4e3b\u52a8\u63d0\u4f9b\u6216\u5728\u4f7f\u7528\u670d\u52a1\u8fc7\u7a0b\u4e2d\u4ea7\u751f\u7684\u4e2a\u4eba\u4fe1\u606f\u3002\u6211\u4eec\u4ec5\u51fa\u4e8e\u5408\u6cd5\u3001\u6b63\u5f53\u4e14\u5fc5\u8981\u7684\u76ee\u7684\u6536\u96c6\u6b64\u7c7b\u4fe1\u606f\u3002"</p>
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">"(A) \u8d44\u6e90\u8d2d\u4e70\u8005 / \u666e\u901a\u7528\u6237"</h3>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. \u8d26\u53f7\u6ce8\u518c\u4e0e\u767b\u5f55"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u60a8\u53ef\u4ee5\u5728\u4e0d\u6ce8\u518c\u8d26\u53f7\u7684\u60c5\u51b5\u4e0b\u6d4f\u89c8\u90e8\u5206\u4fe1\u606f\u3002\u4e3a\u4e86\u521b\u5efa\u5e76\u767b\u5f55\u4e98\u5409\u8d44\u6e90\u5546\u5e97\u8d26\u53f7\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u624b\u673a\u53f7\u7801\u3001\u5bc6\u7801\u3001\u6635\u79f0\u3001\u5934\u50cf\u3002\u82e5\u9002\u7528\u4e2d\u56fd\u6cd5\u5f8b\u6216\u5e73\u53f0\u5408\u89c4\u653f\u7b56\u8981\u6c42\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\u60a8\u7684\u624b\u673a\u53f7\u7801\u7528\u4e8e\u5b9e\u540d\u8ba4\u8bc1\u3002\u82e5\u60a8\u901a\u8fc7\u96c6\u6210\u7684\u4e98\u5409\u8d26\u53f7\u7cfb\u7edf\u767b\u5f55\uff0c\u7ecf\u60a8\u6388\u6743\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u63a5\u6536\u60a8\u7684\u5934\u50cf\u3001\u6635\u79f0\u7b49\u516c\u5f00\u7b80\u4ecb\u4fe1\u606f\u7528\u4e8e\u8d26\u53f7\u540c\u6b65\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. \u6d4f\u89c8\u670d\u52a1"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e3a\u63d0\u5347\u60a8\u7684\u4f53\u9a8c\u5e76\u786e\u4fdd\u5e73\u53f0\u5b89\u5168\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u6d4f\u89c8\u8bb0\u5f55\u3001\u8bbe\u5907\u578b\u53f7\u3001\u64cd\u4f5c\u7cfb\u7edf\u7248\u672c\u3001\u7f51\u7edc\u7c7b\u578b\u3001\u552f\u4e00\u8bbe\u5907\u6807\u8bc6\u7b26\uff08\u5982\u9002\u7528\uff09\u3001IP \u5730\u5740\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. \u8ba2\u5355\u4e0e\u652f\u4ed8"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e3a\u5b8c\u6210\u4ea4\u6613\u5e76\u4fdd\u969c\u652f\u4ed8\u5b89\u5168\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u624b\u673a\u53f7\u7801\u3001\u8ba2\u5355\u53f7\u3001\u4ea4\u6613\u91d1\u989d\u3001\u4e0b\u5355\u65f6\u95f4\u3001\u652f\u4ed8\u65b9\u5f0f\u3001\u652f\u4ed8\u72b6\u6001\u3002\u652f\u4ed8\u670d\u52a1\u53ef\u80fd\u7531\u6301\u6709\u724c\u7167\u7684\u7b2c\u4e09\u65b9\u652f\u4ed8\u673a\u6784\u63d0\u4f9b\u3002\u6211\u4eec\u901a\u5e38\u4ec5\u63a5\u6536\u4ea4\u6613\u7ed3\u679c\u548c\u5fc5\u8981\u7684\u6807\u8bc6\u7b26\uff0c\u800c\u975e\u5b8c\u6574\u7684\u94f6\u884c\u5361\u8be6\u60c5\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"4. \u8bc4\u4ef7\u4e0e\u4e92\u52a8\u529f\u80fd"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u5f53\u60a8\u53d1\u5e03\u8bc4\u5206\u3001\u8bc4\u8bba\u6216\u56de\u590d\u65f6\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u8bc4\u5206\u5206\u503c\u3001\u8bc4\u8bba\u5185\u5bb9\u3001\u76f8\u5173\u4e92\u52a8\u8bb0\u5f55\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"5. \u641c\u7d22\u529f\u80fd"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e3a\u542f\u7528\u5e76\u4f18\u5316\u641c\u7d22\u529f\u80fd\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u641c\u7d22\u5173\u952e\u8bcd\u3001\u641c\u7d22\u7b5b\u9009\u9009\u9879\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"6. \u53cd\u9988\u4e0e\u5ba2\u6237\u652f\u6301"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u5f53\u60a8\u8054\u7cfb\u5ba2\u6237\u652f\u6301\u6216\u63d0\u4ea4\u53cd\u9988\u65f6\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u6635\u79f0\u3001\u8054\u7cfb\u65b9\u5f0f\u3001\u53cd\u9988\u5185\u5bb9\u3001\u4e0a\u4f20\u7684\u6587\u4ef6\u6216\u622a\u56fe\u3002\u526a\u8d34\u677f\u6570\u636e\u4ec5\u5728\u4e3a\u5b8c\u6210\u8f6f\u4ef6\u5185\u7684\u590d\u5236/\u7c98\u8d34\u529f\u80fd\u6240\u5fc5\u9700\u65f6\u624d\u4f1a\u88ab\u8bbf\u95ee\uff0c\u9664\u975e\u60a8\u4e3b\u52a8\u63d0\u4ea4\uff0c\u5426\u5219\u4e0d\u4f1a\u88ab\u4e0a\u4f20\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"7. \u6536\u85cf"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e3a\u63d0\u4f9b\u8d44\u4ea7\u4e66\u7b7e\u529f\u80fd\uff0c\u6211\u4eec\u53ef\u80fd\u4f1a\u6536\u96c6\uff1a\u60a8\u7684\u6536\u85cf\u8bb0\u5f55\u3002"</span>
              </div>
            </div>
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">"(B) \u8d44\u4ea7\u63d0\u4f9b\u8005\uff08\u53d1\u5e03\u8005\uff09"</h3>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. \u63d0\u4f9b\u8005\u4e2a\u4eba\u8d44\u6599\u4fe1\u606f"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u5934\u50cf\u3001\u7528\u6237\u540d\u3001\u7b80\u4ecb/\u63cf\u8ff0\u3001\u7f51\u7ad9\u94fe\u63a5\u3001\u8054\u7cfb\u4eba\u59d3\u540d\u3001\u7535\u8bdd\u53f7\u7801\u3001\u7535\u5b50\u90ae\u7bb1\u5730\u5740\u3001\u7ec4\u7ec7\u4fe1\u606f\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. \u8eab\u4efd\u9a8c\u8bc1"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u4e2a\u4eba\u59d3\u540d\u53ca\u8eab\u4efd\u8bc1\u53f7\u7801\uff1b\u6216\u8425\u4e1a\u6267\u7167\u53ca\u7ec4\u7ec7\u4fe1\u606f\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. \u8d44\u4ea7\u53d1\u5e03\u4fe1\u606f"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u8d44\u4ea7\u6587\u4ef6\u4e0e\u56fe\u50cf\u3001\u4ea7\u54c1\u63cf\u8ff0\u3001\u652f\u6301\u7f51\u7ad9\u4e0e\u652f\u6301\u90ae\u7bb1\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"4. \u6536\u76ca\u63d0\u73b0"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u6cd5\u5b9a\u59d3\u540d\u3001\u94f6\u884c\u8d26\u53f7\u3001\u5fc5\u8981\u7684\u8d22\u52a1\u7ed3\u7b97\u4fe1\u606f\u3002"</span>
              </div>
            </div>
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">"(C) \u5f81\u5f97\u540c\u610f\u7684\u6cd5\u5f8b\u4f8b\u5916"</h3>
            <div className="space-y-2 ml-4">
              <p className="text-muted-foreground leading-relaxed">"\u6839\u636e\u4e2d\u56fd\u6cd5\u5f8b\uff0c\u5728\u4ee5\u4e0b\u60c5\u5f62\u4e0b\uff0c\u6211\u4eec\u5904\u7406\u4e2a\u4eba\u4fe1\u606f\u65e0\u9700\u5f81\u5f97\u60a8\u7684\u6388\u6743\u540c\u610f\uff1a\u4e0e\u56fd\u5bb6\u5b89\u5168\u3001\u56fd\u9632\u5b89\u5168\u76f4\u63a5\u76f8\u5173\u7684\uff1b\u4e0e\u516c\u5171\u5b89\u5168\u3001\u516c\u5171\u536b\u751f\u76f4\u63a5\u76f8\u5173\u7684\uff1b\u4e0e\u5211\u4e8b\u4fa6\u67e5\u6216\u53f8\u6cd5\u7a0b\u5e8f\u76f4\u63a5\u76f8\u5173\u7684\uff1b\u51fa\u4e8e\u7ef4\u62a4\u91cd\u5927\u5408\u6cd5\u6743\u76ca\u4f46\u5728\u96be\u4ee5\u5f97\u5230\u672c\u4eba\u540c\u610f\u7684\u60c5\u51b5\u4e0b\uff1b\u60a8\u81ea\u884c\u5411\u793e\u4f1a\u516c\u4f17\u516c\u5f00\u7684\u4fe1\u606f\uff1b\u4ece\u5408\u6cd5\u516c\u5f00\u6e20\u9053\u6536\u96c6\u7684\u4fe1\u606f\uff1b\u4e3a\u8ba2\u7acb\u3001\u5c65\u884c\u5408\u540c\u6240\u5fc5\u9700\uff1b\u4e3a\u7ef4\u62a4\u670d\u52a1\u5b89\u5168\u7a33\u5b9a\u8fd0\u884c\u6240\u5fc5\u9700\uff1b\u6cd5\u5f8b\u6cd5\u89c4\u89c4\u5b9a\u7684\u5176\u4ed6\u60c5\u5f62\u3002"</p>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u4e8c\u3001Cookie \u53ca\u540c\u7c7b\u6280\u672f"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u6211\u4eec\u53ef\u80fd\u4f1a\u4f7f\u7528 Cookie \u53ca\u540c\u7c7b\u6280\u672f\u7528\u4ee5\uff1a\u8bb0\u4f4f\u767b\u5f55\u72b6\u6001\u3001\u5206\u6790\u4f7f\u7528\u6a21\u5f0f\u3001\u4f18\u5316\u7528\u6237\u4f53\u9a8c\u3002\u60a8\u53ef\u4ee5\u901a\u8fc7\u6d4f\u89c8\u5668\u8bbe\u7f6e\u6e05\u9664 Cookie\uff1b\u4f46\u67d0\u4e9b\u529f\u80fd\u53ef\u80fd\u4f1a\u53d7\u5230\u5f71\u54cd\u3002"</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u4e09\u3001\u4e2a\u4eba\u4fe1\u606f\u7684\u5b58\u50a8"</h2>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. \u5b58\u50a8\u5730\u70b9"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u6211\u4eec\u6536\u96c6\u7684\u6240\u6709\u4e2a\u4eba\u4fe1\u606f\u5747\u5b58\u50a8\u5728\u4e2d\u534e\u4eba\u6c11\u5171\u548c\u56fd\u5883\u5185\u7684\u670d\u52a1\u5668\u4e0a\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. \u5b58\u50a8\u671f\u9650"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u6211\u4eec\u4ec5\u5728\u4e3a\u5b9e\u73b0\u670d\u52a1\u76ee\u7684\u6240\u5fc5\u9700\u7684\u6700\u77ed\u671f\u9650\u5185\uff0c\u6216\u6839\u636e\u4e2d\u56fd\u6cd5\u5f8b\u8981\u6c42\u7684\u671f\u9650\u5185\u4fdd\u7559\u4e2a\u4eba\u4fe1\u606f\u3002\u8d85\u51fa\u671f\u9650\u540e\uff0c\u9664\u975e\u6cd5\u5f8b\u53e6\u6709\u89c4\u5b9a\uff0c\u5426\u5219\u6211\u4eec\u5c06\u5220\u9664\u6570\u636e\u6216\u8fdb\u884c\u533f\u540d\u5316\u5904\u7406\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. \u8de8\u5883\u4f20\u8f93"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u76ee\u524d\uff0c\u6211\u4eec\u4e0d\u4f1a\u5c06\u4e2a\u4eba\u4fe1\u606f\u8f6c\u79fb\u81f3\u4e2d\u56fd\u5927\u9646\u5883\u5916\u3002\u5982\u786e\u9700\u8de8\u5883\u4f20\u8f93\uff0c\u6211\u4eec\u5c06\uff1a\u544a\u77e5\u60a8\u76ee\u7684\u53ca\u63a5\u6536\u65b9\uff1b\u53d6\u5f97\u60a8\u7684\u540c\u610f\uff08\u5982\u6cd5\u5f8b\u8981\u6c42\uff09\uff1b\u8fdb\u884c\u5fc5\u8981\u7684\u5b89\u5168\u8bc4\u4f30\uff1b\u91c7\u53d6\u52a0\u5bc6\u53ca\u6570\u636e\u4fdd\u62a4\u63aa\u65bd\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u56db\u3001\u4e2a\u4eba\u4fe1\u606f\u4fdd\u62a4"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u6211\u4eec\u91c7\u53d6\u5408\u7406\u7684\u7ba1\u7406\u53ca\u6280\u672f\u63aa\u65bd\uff0c\u5305\u62ec\uff1a\u6570\u636e\u52a0\u5bc6\u3001\u8bbf\u95ee\u63a7\u5236\u673a\u5236\u3001\u5185\u90e8\u6570\u636e\u6cbb\u7406\u653f\u7b56\u3001\u4fdd\u5bc6\u534f\u8bae\u3001\u5458\u5de5\u57f9\u8bad\u3002\u82e5\u53d1\u751f\u4e2a\u4eba\u4fe1\u606f\u5b89\u5168\u4e8b\u4ef6\uff0c\u6211\u4eec\u5c06\u6839\u636e\u4e2d\u56fd\u6cd5\u5f8b\u8981\u6c42\u901a\u77e5\u60a8\uff0c\u5e76\u5728\u5fc5\u8981\u65f6\u5411\u76d1\u7ba1\u673a\u6784\u62a5\u544a\u3002\u7531\u4e8e\u6280\u672f\u9650\u5236\uff0c\u6211\u4eec\u65e0\u6cd5\u4fdd\u8bc1 100% \u7684\u5b89\u5168\uff0c\u4f46\u6211\u4eec\u5c06\u5c3d\u4e00\u5207\u5408\u7406\u52aa\u529b\u4fdd\u62a4\u60a8\u7684\u6570\u636e\u3002"</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u4e94\u3001\u5171\u4eab\u3001\u8f6c\u8ba9\u4e0e\u516c\u5f00\u62ab\u9732"</h2>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. \u5171\u4eab"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u9664\u4ee5\u4e0b\u60c5\u5f62\u5916\uff0c\u672a\u7ecf\u60a8\u7684\u540c\u610f\uff0c\u6211\u4eec\u4e0d\u4f1a\u5411\u7b2c\u4e09\u65b9\u5171\u4eab\u4e2a\u4eba\u4fe1\u606f\uff1a\u4e3a\u63d0\u4f9b\u670d\u52a1\uff08\u5982\u5411\u8d44\u4ea7\u63d0\u4f9b\u8005\u63d0\u4f9b\uff09\uff1b\u4e3a\u4f18\u5316\u670d\u52a1\u4f53\u9a8c\uff08\u5411\u5173\u8054\u65b9\u5171\u4eab\uff09\uff1b\u4e3a\u9884\u9632\u6b3a\u8bc8\u5e76\u786e\u4fdd\u5b89\u5168\uff1b\u4e3a\u5c65\u884c\u6cd5\u5f8b\u4e49\u52a1\u3002\u6211\u4eec\u4f1a\u4e0e\u63a5\u6536\u65b9\u7b7e\u7f72\u6570\u636e\u4fdd\u62a4\u534f\u8bae\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. \u8f6c\u8ba9"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u82e5\u53d1\u751f\u5408\u5e76\u3001\u6536\u8d2d\u3001\u8d44\u4ea7\u8f6c\u8ba9\u6216\u7834\u4ea7\u6e05\u7b97\uff1a\u6211\u4eec\u5c06\u544a\u77e5\u60a8\u63a5\u6536\u65b9\u7684\u8eab\u4efd\u53ca\u8054\u7cfb\u65b9\u5f0f\uff1b\u63a5\u6536\u65b9\u987b\u7ee7\u7eed\u5c65\u884c\u672c\u653f\u7b56\uff1b\u82e5\u5904\u7406\u76ee\u7684\u53d1\u751f\u53d8\u66f4\uff0c\u5c06\u91cd\u65b0\u53d6\u5f97\u60a8\u7684\u540c\u610f\u3002"</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. \u516c\u5f00\u62ab\u9732"：</span>
                <span className="text-muted-foreground leading-relaxed">"\u6211\u4eec\u4ec5\u5728\u4ee5\u4e0b\u60c5\u51b5\u4e0b\u516c\u5f00\u62ab\u9732\u4e2a\u4eba\u4fe1\u606f\uff1a\u83b7\u5f97\u60a8\u7684\u660e\u786e\u540c\u610f\u540e\uff1b\u57fa\u4e8e\u6cd5\u5f8b\u3001\u884c\u653f\u6267\u6cd5\u6216\u53f8\u6cd5\u673a\u5173\u7684\u5f3a\u5236\u6027\u8981\u6c42\u3002"</span>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u516d\u3001\u60a8\u7684\u6743\u5229"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u6839\u636e\u4e2d\u56fd\u6cd5\u5f8b\uff0c\u60a8\u6709\u6743\uff1a\u67e5\u8be2\u60a8\u7684\u4e2a\u4eba\u4fe1\u606f\uff1b\u66f4\u6b63\u4e0d\u51c6\u786e\u7684\u4fe1\u606f\uff1b\u5728\u6cd5\u5f8b\u6761\u4ef6\u4e0b\u5220\u9664\u4e2a\u4eba\u4fe1\u606f\uff1b\u64a4\u56de\u540c\u610f\uff1b\u8981\u6c42\u89e3\u91ca\u5904\u7406\u89c4\u5219\u3002\u60a8\u53ef\u4ee5\u901a\u8fc7\u8d26\u53f7\u8bbe\u7f6e\u6216\u8054\u7cfb\u6211\u4eec\u884c\u4f7f\u6743\u5229\u3002\u6211\u4eec\u901a\u5e38\u5c06\u5728 15 \u65e5\u5185\u56de\u590d\u3002"</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u4e03\u3001\u513f\u7ae5\u4e2a\u4eba\u4fe1\u606f"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u6211\u4eec\u7684\u670d\u52a1\u4e3b\u8981\u9762\u5411\u6210\u4eba\u3002\u672a\u6ee1 14 \u5468\u5c81\u7684\u513f\u7ae5\u672a\u7ecf\u76d1\u62a4\u4eba\u540c\u610f\u4e0d\u5f97\u521b\u5efa\u8d26\u53f7\u3002\u82e5\u6211\u4eec\u53d1\u73b0\u672a\u7ecf\u9002\u5f53\u540c\u610f\u6536\u96c6\u4e86\u513f\u7ae5\u4e2a\u4eba\u4fe1\u606f\uff0c\u6211\u4eec\u5c06\u53ca\u65f6\u5220\u9664\u3002"</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u516b\u3001\u9002\u7528\u6cd5\u5f8b\u4e0e\u4e89\u8bae\u89e3\u51b3"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u672c\u653f\u7b56\u53d7\u4e2d\u534e\u4eba\u6c11\u5171\u548c\u56fd\u5927\u9646\u5730\u533a\u6cd5\u5f8b\u7ba1\u8f96\u3002\u56e0\u672c\u653f\u7b56\u5f15\u8d77\u6216\u4e0e\u4e4b\u76f8\u5173\u7684\u4efb\u4f55\u4e89\u8bae\uff0c\u5e94\u9996\u5148\u901a\u8fc7\u53cb\u597d\u534f\u5546\u89e3\u51b3\u3002\u534f\u5546\u4e0d\u6210\u7684\uff0c\u4efb\u4f55\u4e00\u65b9\u5747\u53ef\u5c06\u4e89\u8bae\u63d0\u4ea4\u81f3\u4e0a\u6d77\u4ef2\u88c1\u59d4\u5458\u4f1a\u8fdb\u884c\u4ef2\u88c1\u3002"</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u4e5d\u3001\u653f\u7b56\u66f4\u65b0"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u6211\u4eec\u53ef\u80fd\u4f1a\u4e0d\u65f6\u66f4\u65b0\u672c\u653f\u7b56\u3002\u91cd\u5927\u53d8\u66f4\uff08\u5982\u5904\u7406\u76ee\u7684\u53d8\u66f4\u6216\u7528\u6237\u6743\u5229\u51cf\u5c11\uff09\u5c06\u901a\u8fc7\u663e\u8457\u516c\u544a\u3001\u7535\u5b50\u90ae\u4ef6\u3001\u77ed\u4fe1\u6216\u4ea7\u54c1\u5185\u901a\u77e5\u7b49\u65b9\u5f0f\u544a\u77e5\u3002"</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"\u5341\u3001\u8054\u7cfb\u6211\u4eec"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u5a01\u800c\u68ee\uff08\u4e0a\u6d77\uff09\u8d38\u6613\u6709\u9650\u516c\u53f8 \u2013 \u6cd5\u52a1\u4e0e\u9690\u79c1\u90e8\u95e8"</p>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u5730\u5740\uff1a\u4e0a\u6d77\u5e02\u957f\u5b81\u533a\u5929\u5c71\u8def641\u53f71\u53f7\u697c205\u5ba4"</p>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u90ae\u7bb1\uff1aprivacy@genjiwu.com"</p>
            <p className="text-muted-foreground leading-relaxed mb-3">"\u6211\u4eec\u901a\u5e38\u5c06\u5728\u5341\u4e94 (15) \u65e5\u5185\u56de\u590d\u3002\u5982\u679c\u60a8\u5bf9\u6211\u4eec\u7684\u56de\u590d\u4e0d\u6ee1\u610f\uff0c\u60a8\u53ef\u4ee5\u5411\u4e3b\u7ba1\u7684\u4e2a\u4eba\u4fe1\u606f\u4fdd\u62a4\u673a\u6784\u6295\u8bc9\u3002"</p>
          </section>
            </div>
          ) : (
            <div className="space-y-2">
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"I. How We Collect and Use Your Personal Information"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"When you use GENJI Asset Store and GENJI Studio, we may collect personal information that you voluntarily provide or that is generated during your use of our services. We collect such information only for lawful, legitimate, and necessary purposes."</p>
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">"(A) Asset Purchasers / General Users"</h3>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. Account Registration and Login"：</span>
                <span className="text-muted-foreground leading-relaxed">"You may browse certain information without registering an account. To create and log in to a GENJI Asset Store account, we may collect: mobile phone number, password, nickname, and avatar. If required by applicable PRC laws or platform compliance policies, we may collect your mobile phone number for real-name authentication. If you log in via an integrated GENJI account system, with your authorization we may receive public profile information such as avatar and nickname for account synchronization."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. Browsing Services"：</span>
                <span className="text-muted-foreground leading-relaxed">"To improve your experience and ensure platform security, we may collect: browsing history, device model, operating system version, network type, unique device identifier (where applicable), and IP address."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. Orders and Payment"：</span>
                <span className="text-muted-foreground leading-relaxed">"To complete transactions and ensure payment security, we may collect: mobile phone number, order number, transaction amount, order time, payment method, and payment status. Payment services may be provided by licensed third-party payment institutions. We typically receive transaction results and necessary identifiers rather than full bank card details."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"4. Reviews and Interactive Features"：</span>
                <span className="text-muted-foreground leading-relaxed">"When you post ratings, comments, or reviews, we may collect: rating scores, comment content, and related interaction records."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"5. Search Function"：</span>
                <span className="text-muted-foreground leading-relaxed">"To enable and optimize search functionality, we may collect: search keywords and search filter selections."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"6. Feedback and Customer Support"：</span>
                <span className="text-muted-foreground leading-relaxed">"When you contact customer support or submit feedback, we may collect: nickname, contact information, feedback content, and uploaded files or screenshots. Clipboard data will only be accessed when necessary to complete a copy/paste function within the software and will not be uploaded unless you actively submit it."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"7. Favorites / Collections"：</span>
                <span className="text-muted-foreground leading-relaxed">"To provide asset bookmarking features, we may collect your collection records."</span>
              </div>
            </div>
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">"(B) Asset Providers (Publishers)"</h3>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. Provider Profile Information"：</span>
                <span className="text-muted-foreground leading-relaxed">"Avatar, username, biography/description, website link, contact name, phone number, email address, and organization information."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. Identity Verification"：</span>
                <span className="text-muted-foreground leading-relaxed">"Personal name and identification number; or business license and organization information."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. Asset Publishing Information"：</span>
                <span className="text-muted-foreground leading-relaxed">"Asset files and images, product descriptions, support website and support email."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"4. Revenue Withdrawal"：</span>
                <span className="text-muted-foreground leading-relaxed">"Legal name, bank account number, and required financial settlement information."</span>
              </div>
            </div>
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">"(C) Legal Exceptions to Consent"</h3>
            <div className="space-y-2 ml-4">
              <p className="text-muted-foreground leading-relaxed">"Under PRC law, we may process personal information without prior consent in circumstances including: national security or defense; public safety or public health; criminal investigation or judicial proceedings; protection of significant lawful rights where consent is difficult; information publicly disclosed by you; lawful public information sources; necessary to perform contracts; necessary to maintain service security; and other circumstances required by law."</p>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"II. Cookies and Similar Technologies"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"We may use cookies and similar technologies to: remember login status, analyze usage patterns, and improve user experience. You may clear cookies through browser settings; however, some functions may be affected."</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"III. Storage of Personal Information"</h2>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. Storage Location"：</span>
                <span className="text-muted-foreground leading-relaxed">"All personal information collected by us is stored on servers located within the People's Republic of China."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. Retention Period"：</span>
                <span className="text-muted-foreground leading-relaxed">"We retain personal information only for the minimum period necessary to fulfil service purposes or as required by PRC law. After expiration, we will delete or anonymize the data unless otherwise required by law."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. Cross-Border Transfer"：</span>
                <span className="text-muted-foreground leading-relaxed">"Currently, we do not transfer personal information outside mainland China. If cross-border transfer becomes necessary, we will: inform you of the purpose and recipient; obtain your consent (where required); conduct required security assessments; and implement encryption and data protection measures."</span>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"IV. Protection of Personal Information"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"We implement reasonable technical and organizational measures, including: data encryption, access control mechanisms, internal data governance policies, confidentiality agreements, and employee training. If a personal information security incident occurs, we will notify you in accordance with PRC legal requirements and report to regulatory authorities when necessary. Due to technological limitations, we cannot guarantee 100% security, but we will make every reasonable effort to protect your data."</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"V. Sharing, Transfer, and Public Disclosure"</h2>
            <div className="space-y-2 ml-4">
              <div>
                <span className="font-medium text-foreground">"1. Sharing"：</span>
                <span className="text-muted-foreground leading-relaxed">"We do not share personal information with third parties without consent except: to provide services (e.g., to asset providers); to improve service experience (affiliates); to prevent fraud and ensure security; to comply with legal obligations. We enter into data protection agreements with recipients."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"2. Transfer"：</span>
                <span className="text-muted-foreground leading-relaxed">"In case of merger, acquisition, asset transfer, or bankruptcy: we will notify you of the recipient's identity and contact details; the recipient must continue to comply with this Policy; if processing purpose changes, new consent will be obtained."</span>
              </div>
              <div>
                <span className="font-medium text-foreground">"3. Public Disclosure"：</span>
                <span className="text-muted-foreground leading-relaxed">"We will publicly disclose personal information only: with your explicit consent; or as required by law, administrative enforcement, or judicial authorities."</span>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"VI. Your Rights"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"Under applicable PRC law, you have the right to: access your personal information; correct inaccurate information; delete personal information under lawful conditions; withdraw consent; and request explanation of processing rules. You may exercise your rights via account settings or by contacting us. We will generally respond within 15 days."</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"VII. Children's Personal Information"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"Our services are primarily intended for adults. Children under 14 years old may not create accounts without guardian consent. If we discover collection of children's personal information without proper consent, we will delete it promptly."</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"VIII. Governing Law and Dispute Resolution"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"This Policy shall be governed by the laws of mainland People's Republic of China. Any dispute arising from or related to this Policy shall first be resolved through friendly consultation. If consultation fails, either party may submit the dispute to the Shanghai Arbitration Commission for arbitration."</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"IX. Policy Updates"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"We may update this Policy from time to time. Material changes (such as changes to processing purposes or reduction of user rights) will be notified via prominent notices, email, SMS, or in-product announcements."</p>
          </section>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3 text-foreground">"X. Contact Us"</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">"Vario Trade & Investment Ltd. \u2013 Legal & Privacy Department"</p>
            <p className="text-muted-foreground leading-relaxed mb-3">"Address: Unit 205, Building No.1, Tianshan Road 641, Changning District, 200336 - Shanghai, China"</p>
            <p className="text-muted-foreground leading-relaxed mb-3">"Email: privacy@genjiwu.com"</p>
            <p className="text-muted-foreground leading-relaxed mb-3">"We will generally respond within fifteen (15) days. If you are not satisfied with our response, you may file a complaint with the competent personal information protection authority."</p>
          </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
