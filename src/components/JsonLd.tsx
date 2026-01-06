'use client';

import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';

export default function JsonLd() {
  const { t } = useTranslation();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Image Smart Resizer",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TWD"
    },
    "description": t.seo.description,
    "featureList": t.seo.features,
    "browserRequirements": "Requires JavaScript. Requires HTML5."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}