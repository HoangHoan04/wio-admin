import { formatDateTime } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { Textarea } from "@/components/ui/textarea";
import { useContactDetail, useUpdateContactStatus } from "@/hooks/contact";
import { ArrowLeft, History, MessageSquare, Send, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailSupportTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useContactDetail(id);
  const { onUpdateContactStatus, isLoading: isUpdating } = useUpdateContactStatus();

  const [status, setStatus] = useState<string>("IN_PROGRESS");
  const [adminNote, setAdminNote] = useState<string>("");

  useEffect(() => {
    if (data) {
      setStatus(data.status || "IN_PROGRESS");
      setAdminNote(data.adminNote || "");
    }
  }, [data]);

  const handleSaveResponse = async () => {
    if (!id) return;
    await onUpdateContactStatus({
      id,
      status,
      adminNote,
    });
    await refetch();
  };

  if (isLoading) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center p-12">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  if (!data) {
    return (
      <BaseView>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-12">
          <p className="font-medium text-muted-foreground">
            Không tìm thấy thông tin yêu cầu liên hệ
          </p>
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
      </BaseView>
    );
  }

  const tabs = [
    {
      key: "contact-info",
      title: "Nội dung liên hệ & Phản hồi",
      icon: <MessageSquare className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="size-5 text-primary" />
              <CardTitle>
                Thông tin Yêu Cầu Liên Hệ #{data.code || data.id.substring(0, 8)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Họ tên khách hàng" value={data.name} />
                <InfoItem label="Email liên hệ" value={data.email} />
                <InfoItem label="Số điện thoại" value={data.phone || "N/A"} />
                <InfoItem label="Tiêu đề yêu cầu" value={data.subject || "N/A"} />
                <InfoItem
                  label="Trạng thái hiện tại"
                  value={
                    <StatusTag
                      severity={
                        data.status === "PENDING"
                          ? "danger"
                          : data.status === "IN_PROGRESS"
                            ? "warning"
                            : data.status === "RESOLVED"
                              ? "success"
                              : "secondary"
                      }
                      value={
                        data.status === "PENDING"
                          ? "Mới gửi"
                          : data.status === "IN_PROGRESS"
                            ? "Đang xử lý"
                            : data.status === "RESOLVED"
                              ? "Đã phản hồi"
                              : "Đã đóng"
                      }
                    />
                  }
                />
                <InfoItem
                  label="Thời gian gửi"
                  value={data.createdAt ? formatDateTime(data.createdAt) : "—"}
                />
              </div>

              <div className="mt-6 flex flex-col gap-2 rounded-lg bg-muted/40 p-4 border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nội dung câu hỏi / Tin nhắn từ khách hàng:
                </span>
                <p className="text-sm font-normal text-foreground whitespace-pre-wrap leading-relaxed">
                  {data.message}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MessageSquare className="size-5 text-blue-500" />
              <CardTitle>Xử Lý & Ghi Chú Phản Hồi Từ Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Cập nhật trạng thái:</Label>
                    <select
                      value={status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setStatus(e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="PENDING">Mới gửi (PENDING)</option>
                      <option value="IN_PROGRESS">Đang xử lý (IN_PROGRESS)</option>
                      <option value="RESOLVED">Đã xử lý / Phản hồi (RESOLVED)</option>
                      <option value="CLOSED">Đã đóng (CLOSED)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Ghi chú / Nội dung phản hồi của Admin:
                  </Label>
                  <Textarea
                    rows={5}
                    value={adminNote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setAdminNote(e.target.value)
                    }
                    placeholder="Nhập nội dung phản hồi hoặc ghi chú xử lý yêu cầu..."
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="gap-1.5"
                  >
                    <ArrowLeft className="size-3.5" />
                    Quay lại
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveResponse}
                    disabled={isUpdating}
                    className="gap-1.5"
                  >
                    <Send className="size-3.5" />
                    Lưu phản hồi & Cập nhật
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      key: "logs",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <ActionLog
          entityName="ContactEntity"
          entityId={data.id}
          title={`Lịch sử thao tác liên hệ #${data.code || data.id}`}
        />
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}
