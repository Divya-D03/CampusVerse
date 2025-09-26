
'use client';
import { cn } from "@/lib/utils";

const PhonePeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#5F259F"/>
    <path d="M16.92 10.43a3.54 3.54 0 0 1-1.8-3.15V7.2a.5.5 0 0 0-.7-.45l-4.75 2.1a.5.5 0 0 1-.6-.22L7.3 5.4a.5.5 0 0 0-.9-.13l-1.3 2.62a.5.5 0 0 0 .1.6l2.9 2.1-2.9 2.1a.5.5 0 0 0-.1.6l1.3 2.62a.5.5 0 0 0 .9-.12l1.75-3.23a.5.5 0 0 1 .6-.22l4.75 2.1a.5.5 0 0 0 .7-.45v-.08a3.54 3.54 0 0 1 1.8-3.15z" fill="#fff"/>
  </svg>
);

const PaytmIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00B9F1"/>
    <path d="M16 11.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h2.8l-3.12 6.24a.5.5 0 0 0 .44.76h2.2a.5.5 0 0 0 .45-.28l.9-1.8 1.95 3.9a.5.5 0 0 0 .45.28h2.2a.5.5 0 0 0 .44-.76L13.75 12h2.75a.5.5 0 0 0 .5-.5zm-6.1-4.72a.5.5 0 0 0-.45-.28H7.2a.5.5 0 0 0-.44.76L9.88 13H7.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-2.8l3.12-6.24a.5.5 0 0 0-.44-.76h-2.2a.5.5 0 0 0-.45.28L9.9 10.7 7.95 6.78z" fill="#002E6E"/>
  </svg>
);

const GPayIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.18 10.32v3.13h4.94c-.2 1.5-1.61 3.9-4.94 3.9-2.98 0-5.4-2.43-5.4-5.43s2.42-5.43 5.4-5.43c1.7 0 2.8.72 3.45 1.34l2.43-2.33C14.48 3.96 12.54 3 10.18 3c-4.43 0-8 3.55-8 8.05s3.57 8.05 8 8.05c4.61 0 7.7-3.18 7.7-7.83 0-.5-.05-.9-.12-1.3H10.18z" fill="#4285F4"/>
        <path d="M21.9 9.38h-2.73V6.63h-1.9v2.75h-2.73v1.9h2.73v2.74h1.9v-2.74H21.9v-1.9z" fill="#34A853"/>
    </svg>
);


interface UpiAppsProps {
  app: 'paytm' | 'phonepe' | 'gpay';
  className?: string;
}

export function UpiApps({ app, className }: UpiAppsProps) {
  switch (app) {
    case 'paytm':
      return <PaytmIcon className={className} />;
    case 'phonepe':
      return <PhonePeIcon className={className} />;
    case 'gpay':
      return <GPayIcon className={className} />;
    default:
      return null;
  }
}
