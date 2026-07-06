import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LandPlot,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WIZARD_STEPS } from "@/components/sell/wizard-stepper";

const STEP_ICONS = [LandPlot, Camera, FileCheck2, CheckCircle2];

const PREP_ITEMS = [
  "Basic land details, size, region, and price",
  "Clear photos that show the plot from a few angles",
  "Ownership documents for AcreX review",
];

export default function SellWelcomePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[1040px] items-center py-4 md:py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-lg border border-pf-border-subtle bg-pf-bg-surface px-3 py-1.5 text-[13px] font-medium text-pf-text-secondary">
            <Clock3 size={15} strokeWidth={1.75} className="text-pf-accent" />
            Takes about 5 minutes
          </div>

          <div className="space-y-4">
            <h1 className="max-w-[620px] text-[34px] font-semibold leading-tight text-pf-text-primary md:text-[44px]">
              List your land in a few simple steps
            </h1>
            <p className="max-w-[560px] text-[17px] leading-7 text-pf-text-secondary">
              Tell buyers what makes your plot valuable, add photos and documents,
              then send it to AcreX for review before it goes live.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-lg px-5 text-[16px] font-semibold"
              render={
                <Link href="/sell/start">
                  Get Started
                  <ArrowRight size={18} strokeWidth={2} data-icon="inline-end" />
                </Link>
              }
            />
            <Button
              variant="ghost"
              size="lg"
              className="h-12 rounded-lg px-5 text-[16px] text-pf-text-secondary"
              render={<Link href="/my-ads">Not now</Link>}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-pf-border-subtle bg-pf-bg-surface p-5 shadow-sm">
            <div className="absolute right-5 top-5 flex size-16 items-center justify-center rounded-full bg-pf-accent-subtle">
              <Image
                src="/acrex-icon.svg"
                alt=""
                width={38}
                height={38}
                className="size-[38px]"
              />
            </div>
            <div className="pr-20">
              <p className="text-[13px] font-semibold text-pf-accent">Post land</p>
              <h2 className="mt-2 text-[24px] font-semibold text-pf-text-primary">
                What happens next
              </h2>
            </div>

            <ol className="mt-6 space-y-3">
              {WIZARD_STEPS.map((step, index) => {
                const Icon = STEP_ICONS[index] ?? LandPlot;

                return (
                  <li
                    key={step}
                    className="flex items-center gap-3 rounded-lg border border-pf-border-subtle bg-pf-bg-base px-3.5 py-3"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pf-accent-subtle text-pf-accent">
                      <Icon size={18} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-pf-text-tertiary">
                        Step {index + 1}
                      </p>
                      <p className="text-[15px] font-semibold text-pf-text-primary">
                        {step}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <Card className="border-pf-border-subtle bg-pf-bg-surface">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-pf-text-primary">
                <MapPinned size={18} strokeWidth={1.75} className="text-pf-accent" />
                Have these ready
              </div>
              <ul className="space-y-2">
                {PREP_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-[14px] leading-6 text-pf-text-secondary"
                  >
                    <ShieldCheck
                      size={16}
                      strokeWidth={1.75}
                      className="mt-1 shrink-0 text-pf-success"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
