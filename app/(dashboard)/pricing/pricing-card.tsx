'use client';

import { checkoutAction } from '@/lib/payments/actions';
import { Check, CheckCircle2 } from 'lucide-react';
import { SubmitButton } from './submit-button';
import useSWR from 'swr';

type TeamData = {
    subscriptionStatus?: string | null;
    planName?: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PricingCard({
    name,
    price,
    interval,
    trialDays,
    features,
    priceId,
}: {
    name: string;
    price: number;
    interval: string;
    trialDays: number;
    features: string[];
    priceId?: string;
}) {
    const { data: teamData } = useSWR<TeamData>('/api/team', fetcher);
    const hasActiveSubscription =
        teamData?.subscriptionStatus === 'active' ||
        teamData?.subscriptionStatus === 'trialing';

    return (
        <div className="pt-6 border rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
            <p className="text-sm text-gray-600 mb-4">
                with {trialDays} day free trial
            </p>
            <p className="text-4xl font-medium text-gray-900 mb-6">
                ${price / 100}{' '}
                <span className="text-xl font-normal text-gray-600">
                    per user / {interval}
                </span>
            </p>
            <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
            {hasActiveSubscription ? (
                <div className="w-full rounded-full bg-green-50 border border-green-200 py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">คุณเป็นสมาชิกแล้ว</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                        แผนปัจจุบัน: {teamData?.planName || 'Active'}
                    </p>
                </div>
            ) : (
                <form action={checkoutAction}>
                    <input type="hidden" name="priceId" value={priceId} />
                    <SubmitButton />
                </form>
            )}
        </div>
    );
}

