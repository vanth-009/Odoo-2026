import { redirect } from 'next/navigation';

export default function SocialReportsPage() {
  redirect('/reports?module=Social');
}
