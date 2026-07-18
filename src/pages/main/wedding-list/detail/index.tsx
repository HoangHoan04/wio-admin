import { formatDateTime } from "@/common/helpers";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useWeddingDetail } from "@/hooks/wedding";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  Heart,
  MapPin,
  Music,
  Armchair,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import WeddingTablesTab from "./WeddingTablesTab";

export default function DetailWeddingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useWeddingDetail(id);

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

  const tabs = [
    {
      key: "1",
      title: "Thông tin cặp đôi",
      icon: <Heart className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Slug" value={data.slug || "N/A"} />
                <InfoItem label="Chú rể" value={data.groomName || "N/A"} />
                <InfoItem label="Cô dâu" value={data.brideName || "N/A"} />
                <InfoItem label="Hashtag" value={data.hashtag || "N/A"} />
                <InfoItem label="Trạng thái" value={data.status || "N/A"} />
                <InfoItem
                  label="Ngày tạo"
                  value={formatDateTime(data.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  Lễ cưới
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem
                    label="Ngày tổ chức"
                    value={
                      data.ceremonyAt ? formatDateTime(data.ceremonyAt) : "N/A"
                    }
                  />
                  <InfoItem
                    label="Địa điểm"
                    value={data.ceremonyVenue || "N/A"}
                  />
                  <InfoItem
                    label="Địa chỉ"
                    value={data.ceremonyAddress || "N/A"}
                  />
                </div>
              </CardContent>
            </Card>

            {data.receptionAt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Tiệc cưới
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <InfoItem
                      label="Ngày tổ chức"
                      value={formatDateTime(data.receptionAt)}
                    />
                    <InfoItem
                      label="Địa điểm"
                      value={data.receptionVenue || "N/A"}
                    />
                    <InfoItem
                      label="Địa chỉ"
                      value={data.receptionAddress || "N/A"}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {(data.musicUrl ||
            data.groomBankAccount ||
            data.brideBankAccount) && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.musicUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="size-4" />
                      Nhạc nền
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InfoItem label="URL nhạc" value={data.musicUrl} />
                    {data.musicType && (
                      <InfoItem label="Loại nhạc" value={data.musicType} />
                    )}
                    <InfoItem
                      label="Tự động phát"
                      value={data.musicAutoplay ? "Có" : "Không"}
                    />
                  </CardContent>
                </Card>
              )}

              {data.groomBankAccount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="size-4" />
                      Tài khoản chú rể mừng cưới
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <InfoItem
                        label="Số tài khoản"
                        value={data.groomBankAccount}
                      />
                      <InfoItem
                        label="Ngân hàng"
                        value={data.groomBankName || "N/A"}
                      />
                      <InfoItem
                        label="Chủ tài khoản"
                        value={data.groomBankOwner || "N/A"}
                      />
                      {data.groomQrUrl && (
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground block mb-1">
                            Mã QR
                          </span>
                          <img
                            src={data.groomQrUrl}
                            alt="QR Groom"
                            className="w-32 h-32 object-contain border p-1 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.brideBankAccount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="size-4" />
                      Tài khoản cô dâu mừng cưới
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <InfoItem
                        label="Số tài khoản"
                        value={data.brideBankAccount}
                      />
                      <InfoItem
                        label="Ngân hàng"
                        value={data.brideBankName || "N/A"}
                      />
                      <InfoItem
                        label="Chủ tài khoản"
                        value={data.brideBankOwner || "N/A"}
                      />
                      {data.brideQrUrl && (
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground block mb-1">
                            Mã QR
                          </span>
                          <img
                            src={data.brideQrUrl}
                            alt="QR Bride"
                            className="w-32 h-32 object-contain border p-1 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

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
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}
