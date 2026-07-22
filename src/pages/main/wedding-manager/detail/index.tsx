import { formatDateTime } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useWeddingDetail } from "@/hooks/wedding";
import {
  Armchair,
  ArrowLeft,
  Banknote,
  Clock,
  Heart,
  History,
  Link2,
  MapPin,
  MessageCircle,
  Music,
  Palette,
  QrCode,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WeddingTablesTab from "./WeddingTablesTab";
import WeddingWishesTab from "./WeddingWishesTab";

const STATUS_MAP: Record<
  string,
  { label: string; severity: "success" | "warning" | "secondary" | "danger" }
> = {
  DRAFT: { label: "Bản nháp", severity: "secondary" },
  PUBLISHED: { label: "Đang hoạt động", severity: "success" },
  ARCHIVED: { label: "Lưu trữ", severity: "warning" },
  EXPIRED: { label: "Hết hạn", severity: "danger" },
};

export default function DetailWeddingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useWeddingDetail(id);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  if (!data) {
    return (
      <BaseView>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="font-medium text-muted-foreground">
            Không tìm thấy thông tin đám cưới
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại danh sách
          </Button>
        </div>
      </BaseView>
    );
  }

  const status = STATUS_MAP[data.status] || {
    label: data.status,
    severity: "secondary" as const,
  };

  const handleCopyLink = () => {
    if (data.shareUrl) {
      navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Gộp mốc thời gian lễ cưới thành 1 dòng thời gian trực quan
  const milestones = [
    data.engagementAt && {
      label: "Lễ đính hôn",
      at: data.engagementAt,
      venue: data.engagementVenue,
    },
    data.ceremonyAt && {
      label: "Lễ thành hôn",
      at: data.ceremonyAt,
      venue: data.ceremonyVenue,
    },
    data.receptionAt && {
      label: "Tiệc cưới",
      at: data.receptionAt,
      venue: data.receptionVenue,
    },
  ].filter(Boolean) as { label: string; at: string; venue?: string }[];

  const tabs = [
    {
      key: "1",
      title: "Thông tin cặp đôi",
      icon: <Heart className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          {/* HERO: Cặp đôi */}
          <Card className="overflow-hidden border-none ">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
                <PersonAvatar
                  name={data.groomName}
                  title={data.groomTitle}
                  photoUrl={data.groomPhotoUrl}
                  side="groom"
                />
                <div className="flex flex-col items-center gap-1 text-rose-400">
                  <Heart className="size-8 fill-rose-400" />
                  {data.hashtag && (
                    <span className="text-xs font-medium text-rose-500">
                      #{data.hashtag}
                    </span>
                  )}
                </div>
                <PersonAvatar
                  name={data.brideName}
                  title={data.brideTitle}
                  photoUrl={data.bridePhotoUrl}
                  side="bride"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <StatusTag severity={status.severity} value={status.label} />
                {data.template?.themeCode && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                    <Sparkles className="size-3" />
                    {data.template.themeCode}
                  </span>
                )}
                {data.template?.isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    Premium
                  </span>
                )}
              </div>

              {/* Link chia sẻ + QR */}
              <div className="mt-6 flex flex-col items-center gap-3">
                {data.shareUrl && (
                  <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                    <Link2 className="size-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {data.shareUrl}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={handleCopyLink}
                    >
                      {copied ? "Đã sao chép" : "Sao chép"}
                    </Button>
                    {data.shareQrUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 gap-1 px-2 text-xs"
                        onClick={() => setShowQr((v) => !v)}
                      >
                        <QrCode className="size-3.5" />
                        QR
                      </Button>
                    )}
                  </div>
                )}
                {showQr && data.shareQrUrl && (
                  <img
                    src={data.shareQrUrl}
                    alt="QR thiệp cưới"
                    className="size-32 rounded-lg border bg-white p-2"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline mốc thời gian */}
          {milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Dòng thời gian sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative flex flex-col gap-6 pl-6">
                  <div className="absolute left-1.75 top-1 bottom-1 w-px bg-border" />
                  {milestones.map((m, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-6 top-1 size-3.5 rounded-full border-2 border-rose-400 bg-white" />
                      <p className="text-sm font-semibold text-foreground">
                        {m.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(m.at)}
                      </p>
                      {m.venue && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {m.venue}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chi tiết địa điểm */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <VenueCard
              title="Lễ thành hôn"
              at={data.ceremonyAt}
              venue={data.ceremonyVenue}
              address={data.ceremonyAddress}
              mapsUrl={data.ceremonyMapsUrl}
            />
            {data.receptionAt && (
              <VenueCard
                title="Tiệc cưới"
                at={data.receptionAt}
                venue={data.receptionVenue}
                address={data.receptionAddress}
                mapsUrl={data.receptionMapsUrl}
              />
            )}
          </div>

          {/* Thông tin gia đình 2 bên */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FamilyCard
              label="Nhà trai"
              name={data.groomName}
              address={data.groomAddress}
              father={data.groomFatherName}
              mother={data.groomMotherName}
            />
            <FamilyCard
              label="Nhà gái"
              name={data.brideName}
              address={data.brideAddress}
              father={data.brideFatherName}
              mother={data.brideMotherName}
            />
          </div>

          {/* Dress code + nhạc nền */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.dressCodes && data.dressCodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="size-4" />
                    Dress code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {data.dressCodes.map((color: string) => (
                      <div
                        key={color}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="size-10 rounded-full border shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {data.musicUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="size-4" />
                    Nhạc nền
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <InfoItem label="Tên nhạc" value={data.musicName || "N/A"} />
                  <InfoItem
                    label="Tự động phát"
                    value={data.musicAutoplay ? "Có" : "Không"}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bank / mừng cưới */}
          {(data.groomBankAccount || data.brideBankAccount) && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.groomBankAccount && (
                <BankCard
                  title="Tài khoản chú rể"
                  account={data.groomBankAccount}
                  bankName={data.groomBankName}
                  owner={data.groomBankOwner}
                  qrUrl={data.groomQrUrl}
                />
              )}
              {data.brideBankAccount && (
                <BankCard
                  title="Tài khoản cô dâu"
                  account={data.brideBankAccount}
                  bankName={data.brideBankName}
                  owner={data.brideBankOwner}
                  qrUrl={data.brideQrUrl}
                />
              )}
            </div>
          )}

          {/* Lời mời / lời cảm ơn */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.invitationText && (
              <QuoteCard title="Thiệp mời" text={data.invitationText} />
            )}
            {data.thankYouText && (
              <QuoteCard title="Lời cảm ơn" text={data.thankYouText} />
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      title: "Bàn tiệc",
      icon: <Armchair className="size-3.5" />,
      content: <WeddingTablesTab weddingId={id || ""} />,
    },
    {
      key: "3",
      title: "Lời chúc",
      icon: <MessageCircle className="size-3.5" />,
      content: <WeddingWishesTab weddingId={id || ""} />,
    },
    {
      key: "4",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <ActionLog
          entityName="CustomerEntity"
          entityId={data.id}
          title={`Lịch sử thao tác của thiệp cưới: ${data.groomName} & ${data.brideName}`}
        />
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function PersonAvatar({
  name,
  title,
  photoUrl,
  side,
}: {
  name?: string;
  title?: string;
  photoUrl?: string;
  side: "groom" | "bride";
}) {
  const ringColor = side === "groom" ? "ring-sky-300" : "ring-rose-300";
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`size-24 overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ${ringColor}`}
      >
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-2xl font-semibold text-muted-foreground">
            {name?.charAt(0) || "?"}
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">{name || "N/A"}</p>
        {title && <p className="text-xs text-muted-foreground">{title}</p>}
      </div>
    </div>
  );
}

function VenueCard({
  title,
  at,
  venue,
  address,
  mapsUrl,
}: {
  title: string;
  at?: string | null;
  venue?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <InfoItem
          label="Ngày tổ chức"
          value={at ? formatDateTime(at) : "N/A"}
        />
        <InfoItem label="Địa điểm" value={venue || "N/A"} />
        <InfoItem label="Địa chỉ" value={address || "N/A"} />
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="mt-1 gap-1.5">
              <MapPin className="size-3.5" />
              Xem trên bản đồ
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function FamilyCard({
  label,
  name,
  address,
  father,
  mother,
}: {
  label: string;
  name?: string;
  address?: string;
  father?: string;
  mother?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoItem label="Họ tên" value={name || "N/A"} />
        <InfoItem label="Địa chỉ" value={address || "N/A"} />
        <InfoItem label="Bố" value={father || "N/A"} />
        <InfoItem label="Mẹ" value={mother || "N/A"} />
      </CardContent>
    </Card>
  );
}

function BankCard({
  title,
  account,
  bankName,
  owner,
  qrUrl,
}: {
  title: string;
  account: string;
  bankName?: string;
  owner?: string;
  qrUrl?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <InfoItem label="Số tài khoản" value={account} />
            <InfoItem label="Ngân hàng" value={bankName || "N/A"} />
            <InfoItem label="Chủ tài khoản" value={owner || "N/A"} />
          </div>
          {qrUrl && (
            <img
              src={qrUrl}
              alt="Mã QR"
              className="size-24 shrink-0 rounded-md border bg-white p-1"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuoteCard({ title, text }: { title: string; text: string }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-sm italic text-muted-foreground">
          "{text}"
        </p>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
