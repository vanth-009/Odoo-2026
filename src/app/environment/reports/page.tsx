import { redirect } from 'next/navigation';

export default function EnvironmentalReportsPage() {
  redirect('/governance/reports?module=Environmental');
}
