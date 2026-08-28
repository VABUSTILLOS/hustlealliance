'use client';

import { CouponForm } from '../components/CouponForm';

export default function NewCouponPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-8">New Coupon</h1>
      <CouponForm />
    </div>
  );
}
