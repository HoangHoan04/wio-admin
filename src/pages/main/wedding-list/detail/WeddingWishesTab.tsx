import { useEffect, useState } from "react";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/store/toastStore";
import { formatDateTime } from "@/common/helpers";

interface WishItem {
  id: string;
  guestName: string;
  content: string;
  isApproved: boolean;
  isPinned: boolean;
  createdAt: string;
  approvedAt?: string;
}

export default function WeddingWishesTab({ weddingId }: { weddingId: string }) {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchWishes = async () => {
    setIsLoading(true);
    try {
      const res = await rootApiService.post(API_ENDPOINTS.WISH.PAGINATION, {
        skip: 0,
        take: 1000,
        where: { weddingId },
      }) as any;
      setWishes(res.data || []);
    } catch (err: any) {
      console.error(err);
      showToast({
        type: "error",
        message: "Không thể tải danh sách lời chúc",
        title: "Lỗi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (weddingId) {
      fetchWishes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-muted-foreground">Đang tải danh sách lời chúc...</div>;
  }

  if (wishes.length === 0) {
    return <div className="p-6 text-center text-sm text-muted-foreground">Chưa có lời chúc nào cho đám cưới này.</div>;
  }

  return (
    <div className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên khách mời</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ghim</TableHead>
              <TableHead>Ngày gửi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wishes.map((wish) => (
              <TableRow key={wish.id}>
                <TableCell className="font-medium">{wish.guestName}</TableCell>
                <TableCell className="max-w-80 truncate">{wish.content}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      wish.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {wish.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
                </TableCell>
                <TableCell>
                  {wish.isPinned ? (
                    <span className="text-blue-600 font-medium">Có</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{formatDateTime(wish.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
