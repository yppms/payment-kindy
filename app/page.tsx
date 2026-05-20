"use client";

import { useState } from "react";
import { Info, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BASE_AMOUNT = 5_000_000;
const LUNAS_DISCOUNT = 250_000;
const SIBLING_DISCOUNT_RATE = 0.1;
const NITIP_MINIMUM = 1_000_000;

const PAYMENT_LINKS: Record<string, string> = {
  lunas: "https://app.midtrans.com/payment-links/yppms-tk-2627-l-2ktDulim",
  "lunas-diskon": "https://app.midtrans.com/payment-links/yppms-tk-2627-l-d-swgyKCeY",
  "50persen": "https://app.midtrans.com/payment-links/yppms-tk-2627-50-P1F3uWR5",
  "50persen-diskon": "https://app.midtrans.com/payment-links/yppms-tk-2627-50-d-WXRUHSai",
  nitip: "https://app.midtrans.com/payment-links/yppms-tk-2627-n-0WPbiJW4",
};

const paymentOptions = [
  {
    id: "lunas",
    title: "Lunas",
    description: "Dapatkan potongan pelunasan Rp250.000, berlaku hingga ",
    deadline: "13 Juli 2026",
    badge: "Disarankan",
  },
  {
    id: "50persen",
    title: "50%",
    description: "Bayar dalam 2 termin: 50% saat ini dan 50% paling lambat ",
    deadline: "31 Oktober 2026",
  },
  {
    id: "nitip",
    title: "Nitip",
    description: "50% atau pelunasan paling lambat ",
    deadline: "13 Juli 2026",
    minimum: "Rp1.000.000",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentForm() {
  const [paymentType, setPaymentType] = useState("");
  const [siblingActive, setSiblingActive] = useState(false);
  const [siblingName, setSiblingName] = useState("");

  const siblingDiscount = siblingActive
    ? Math.round(
        (paymentType === "lunas" ? BASE_AMOUNT - LUNAS_DISCOUNT : BASE_AMOUNT) *
          SIBLING_DISCOUNT_RATE,
      )
    : 0;
  const discountedBase = BASE_AMOUNT - siblingDiscount;
  const totalBaseAfterDiscounts =
    paymentType === "lunas"
      ? BASE_AMOUNT - LUNAS_DISCOUNT - siblingDiscount
      : discountedBase;

  const totalAmount =
    paymentType === "lunas"
      ? discountedBase - LUNAS_DISCOUNT
      : paymentType === "50persen"
        ? discountedBase / 2
        : paymentType === "nitip"
          ? NITIP_MINIMUM
          : 0;

  const handlePaymentClick = () => {
    if (!paymentType) return;
    const key = siblingActive && paymentType !== "nitip" ? `${paymentType}-diskon` : paymentType;
    const link = PAYMENT_LINKS[key];
    if (link) window.open(link, "_blank");
  };

  const handleSiblingChange = (checked: boolean) => {
    setSiblingActive(checked);
    if (!checked) setSiblingName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-2 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pembayaran Biaya Masuk
          </CardTitle>
          <p className="text-muted-foreground text-center mt-2">
            Assalamualaikum Ayah Bunda. Terima Kasih telah tertarik memilih TKIT
            Miftahussalam sebagai partner pendidikan Anda
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info banner */}
          <Card className="bg-blue-50">
            <CardContent className="flex items-start gap-4 p-4">
              <Info className="text-blue-600 w-6 h-6 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="mb-2">
                  Tahap ini adalah tahap pembayaran biaya masuk dan kemudian
                  pemberkasan.
                </p>
                <p className="mb-2">
                  Apabila Ayah Bunda ingin melakukan kunjungan kembali, school
                  tour, maupun trial-class: Jangan ragu untuk menghubungi kami.
                </p>
                <p className="font-medium">
                  Apabila sudah mantap: silahkan ikuti alur pembayaran berikut
                  ini
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment type */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-900 tracking-wide uppercase border-l-4 border-blue-500 pl-3">Pilih Jenis Pembayaran</p>
            <RadioGroup
              value={paymentType}
              onValueChange={(value) => {
                setPaymentType(value);
              }}
              className="space-y-2"
            >
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all hover:bg-blue-50
                    ${paymentType === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={option.id}
                    className="flex flex-col cursor-pointer pr-16"
                  >
                    <span className="font-bold text-gray-900 text-base">
                      {option.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {option.description}
                      {option.deadline && (
                        <span className="font-bold">{option.deadline}</span>
                      )}
                    </span>
                  </Label>
                  {option.badge && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {option.badge}
                    </span>
                  )}
                  {paymentType === option.id && (
                    <Check className="absolute right-4 bottom-4 h-5 w-5 text-blue-600" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sibling / referral discount */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={siblingActive}
                onCheckedChange={handleSiblingChange}
              />
              <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 text-green-600" />
                <span>Potongan Saudara Kandung</span>
              </div>
            </div>

            {siblingActive && (
              <div className="space-y-2">
                <Input
                  placeholder="Nama saudara kandung / sepupu / referal"
                  value={siblingName}
                  onChange={(e) => setSiblingName(e.target.value)}
                  className="text-sm placeholder:text-xs sm:placeholder:text-sm"
                />
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠️ Akan diverifikasi oleh pihak sekolah. Apabila tidak valid,
                  pembayaran akan dikembalikan.
                </p>
              </div>
            )}
          </div>

          {/* Rincian */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rincian
              </h3>
              <div className="space-y-3">
                {paymentType === "lunas" && (
                  <div className="flex justify-between text-green-700">
                    <span>Potongan Pelunasan</span>
                    <span>-{formatCurrency(LUNAS_DISCOUNT)}</span>
                  </div>
                )}
                {siblingActive && (
                  <div className="flex justify-between text-green-700">
                    <span>Potongan Saudara Kandung (10%)</span>
                    <span>-{formatCurrency(siblingDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Total Biaya Masuk</span>
                  <span>{formatCurrency(totalBaseAfterDiscounts)}</span>
                </div>

                {paymentType && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-semibold text-gray-900 text-base">
                      <span>Tagihan</span>
                      <span>
                        {paymentType === "nitip" && (
                          <span className="text-s font-semibold mr-1">min.</span>
                        )}
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <TooltipProvider delayDuration={0}>
            <div className="w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full block">
                    <Button
                      onClick={handlePaymentClick}
                      aria-disabled={!paymentType}
                      className={`w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center mb-2 transition-opacity${!paymentType ? " opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Bayar Sekarang
                    </Button>
                  </span>
                </TooltipTrigger>
                {!paymentType && (
                  <TooltipContent side="top">
                    Pilih jenis pembayaran terlebih dahulu
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </TooltipProvider>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Kami bekerja sama dengan{" "}
            <a
              href="https://midtrans.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Midtrans
            </a>{" "}
            sebagai mitra teknologi pembayaran.
          </p>

          {/* Payment method logos */}
          <div className="mt-8 mb-6">
            <p className="text-sm font-medium text-center text-gray-700 mb-4">
              Metode pembayaran yang didukung:
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {[
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bri-hL0dIkHMv1D0gRzsyEIvRz5BTJ5gU1.png",
                  alt: "BRI",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bni-PXIkQmmu260B1Cf0GtW3Cj9WwcJDfw.png",
                  alt: "BNI",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mandiri-FC1mw1ms4rImw0HAzXEc9PM8zkBC7S.png",
                  alt: "Mandiri",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cimbniaga-OCjw4nrhPsHWbKa2NXrmkjZODip8TQ.png",
                  alt: "CIMB Niaga",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/permata_bank-RgXWfTIzekingYWlAvJrR5c0ZRSTWT.png",
                  alt: "Permata Bank",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bank_transfer_network_atm_bersama-ehvOpvbWV3DTZQlue3vAdwiKPmMuwP.png",
                  alt: "ATM Bersama",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qris-WI3lbTvUzgjpBVObU8QiWD1PAWIDoa.png",
                  alt: "QRIS",
                },
                {
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gopay-gDOzUF260lu2C25rhjpywG1D6pVLzL.png",
                  alt: "GoPay",
                },
              ].map((img, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center transition-all hover:shadow-md hover:border-gray-300"
                >
                  <img
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    className="max-w-full max-h-6 sm:max-h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp contact */}
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Apabila ada kendala atau pertanyaan, hubungi WhatsApp
                0851-9591-8991
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://wa.me/6285195918991?text=Assalamualaikum..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
