import { formatDateTime } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useInvitationDetail } from "@/hooks/invitation";
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

export default function DetailInvitationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useInvitationDetail(id);
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
            Không tìm thấy thông tin thiệp
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

  const hosts = data.hosts || [];
  const events = data.events || [];
  const gifts = data.gifts || [];
  const dressCodes: string[] = Array.isArray(data.extraContent?.dressCodes)
    ? data.extraContent.dressCodes
    : [];
  const milestones = events
    .filter((event: any) => event.startsAt)
    .map((event: any) => ({
      label: event.title || event.eventKey || "Sự kiện",
      at: event.startsAt as string,
      venue: event.venue,
    }));

  const tabs = [
    {
      key: "1",
      title: "Thông tin thiệp",
      icon: <Heart className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card className="overflow-hidden border-none ">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
                {hosts.length > 0 ? (
                  hosts.map((host: any, index: number) => (
                    <PersonAvatar
                      key={host.id || `${host.role}-${index}`}
                      name={host.fullName}
                      title={host.honorific || host.role}
                      photoUrl={host.photoUrl}
                      side={host.role}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">{data.title}</p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <StatusTag severity={status.severity} value={status.label} />
                {data.hashtag && (
                  <span className="text-xs font-medium text-rose-500">
                    #{data.hashtag}
                  </span>
                )}
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
                  {milestones.map((m: any, i: number) => (
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {events.map((event: any, index: number) => (
              <VenueCard
                key={event.id || `${event.eventKey}-${index}`}
                title={event.title || event.eventKey || "Sự kiện"}
                at={event.startsAt}
                venue={event.venue}
                address={event.address}
                mapsUrl={event.mapsUrl}
              />
            ))}
          </div>

          {hosts.some((host: any) => host.family) && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {hosts.map((host: any, index: number) =>
                host.family ? (
                  <FamilyCard
                    key={host.id || `family-${index}`}
                    label={host.role || host.fullName}
                    name={host.fullName}
                    address={host.family.address}
                    father={host.family.fatherName || host.family.father}
                    mother={host.family.motherName || host.family.mother}
                  />
                ) : null,
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {dressCodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="size-4" />
                    Dress code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {dressCodes.map((color: string) => (
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

            {data.music?.url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="size-4" />
                    Nhạc nền
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <InfoItem label="Tên nhạc" value={data.music.name || "N/A"} />
                  <InfoItem
                    label="Tự động phát"
                    value={data.music.autoplay ? "Có" : "Không"}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {gifts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {gifts.map((gift: any, index: number) => (
                <BankCard
                  key={gift.id || `gift-${index}`}
                  title={gift.label || "Tài khoản mừng"}
                  account={gift.accountNumber || "N/A"}
                  bankName={gift.bankName}
                  owner={gift.accountOwner}
                  qrUrl={gift.qrUrl}
                />
              ))}
            </div>
          )}

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
      content: <WeddingTablesTab invitationId={id || ""} />,
    },
    {
      key: "3",
      title: "Lời chúc",
      icon: <MessageCircle className="size-3.5" />,
      content: <WeddingWishesTab invitationId={id || ""} />,
    },
    {
      key: "4",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <ActionLog
          entityName="CustomerEntity"
          entityId={data.id}
          title={`Lịch sử thao tác của thiệp: ${data.title}`}
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
  side?: string;
}) {
  const ringColor =
    side === "groom" || side === "GROOM" ? "ring-sky-300" : "ring-rose-300";
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
