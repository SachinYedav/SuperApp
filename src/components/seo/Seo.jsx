import React from "react";
import { siteConfig } from "@/config/siteConfig";

export default function Seo({ 
    title, 
    description, 
    keywords,
    image, 
    url, 
    type = "website", 
    publishedTime,
    modifiedTime,
    author
}) {
  // --- Metadata Construction Logic  ---
  const siteTitle = siteConfig.name;
  const fullTitle = title ? `${title} | ${siteTitle}` : siteConfig.title;
  
  const metaDescription = (description || siteConfig.description).substring(0, 160);
  const metaKeywords = keywords || siteConfig.keywords;
  
  const domain = siteConfig.url;
  const currentUrl = url ? url : window.location.href;
  
  let metaImage = image || siteConfig.logo;
  if (image && !image.startsWith('http')) {
      metaImage = `${domain}${image}`;
  }

  // --- Structured Data (JSON-LD) ---
  let jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteTitle,
      "url": domain,
      "description": siteConfig.description,
      "author": {
          "@type": "Organization",
          "name": siteConfig.author
      }
    }
  ];

  if (type === "article") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": metaDescription,
      "image": metaImage,
      "datePublished": publishedTime || new Date().toISOString(),
      "dateModified": modifiedTime || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": author || siteConfig.author
      },
      "publisher": {
        "@type": "Organization",
        "name": siteTitle,
        "logo": {
          "@type": "ImageObject",
          "url": siteConfig.logo
        }
      }
    });
  }

  if (type === "tool") {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": fullTitle,
        "description": metaDescription,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Works in Chrome, Firefox, Edge.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
      });
  }

  if (type === "docs") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "TechArticle", 
      "headline": fullTitle,
      "description": metaDescription,
      "image": metaImage,
      "proficiencyLevel": "Beginner", 
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      },
      "author": {
        "@type": "Person",
        "name": author || siteConfig.author
      },
      "publisher": {
        "@type": "Organization",
        "name": siteTitle,
        "logo": {
          "@type": "ImageObject",
          "url": siteConfig.logo
        }
      },
      "datePublished": publishedTime || "2026-02-20T00:00:00Z", 
      "dateModified": modifiedTime || new Date().toISOString(),
      "articleSection": "Documentation",
      "dependencies": "React 19, Appwrite, Tailwind CSS" 
    });
  }

  return (
    <>
      {/* Standard Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author || siteConfig.author} />
      <link rel="canonical" href={currentUrl} />
      <meta name="theme-color" content={siteConfig.themeColor} />

      {/* Open Graph */}
      <meta property="og:type" content={type === 'tool' ? 'website' : type} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:creator" content={siteConfig.twitterHandle} />

      {/* JSON-LD Script */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </>
  );
}