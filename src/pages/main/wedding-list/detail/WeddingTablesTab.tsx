import { useEffect, useState } from "react";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/store/toastStore";

interface TableItem {
  id: string;
  name: string;
  maxSeats: number;
  currentSeats: number;
  description?: string;
  createdAt: string;
}

export default function WeddingTablesTab({ weddingId }: { weddingId: string }) {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const res = await rootApiService.post(API_ENDPOINTS.TABLE.PAGINATION, {
        skip: 0,
        take: 100,
        where: { weddingId },
      }) as any;
      setTables(res.data || []);
    } catch (err: any) {
      console.error(err);
      showToast({
        type: "error",
        message: "Không thể tải danh sách bàn tiệc",
        title: "Lỗi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (weddingId) {
      fetchTables();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bàn tiệc này?")) return;
    try {
      await rootApiService.post(API_ENDPOINTS.TABLE.DELETE, { id });
      showToast({
        type: "success",
        message: "Xóa bàn tiệc thành công",
        title: "Thành công",
      });
      fetchTables();
    } catch (err: any) {
      console.error(err);
      showToast({
        type: "error",
        message: err.message || "Xóa thất bại",
        title: "Lỗi",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-muted-foreground">Đang tải danh sách bàn tiệc...</div>;
  }

  if (tables.length === 0) {
    return <div className="p-6 text-center text-sm text-muted-foreground">Chưa có bàn tiệc nào được tạo cho đám cưới này.</div>;
  }

  return (
    <div className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên bàn</TableHead>
              <TableHead>Số chỗ tối đa</TableHead>
              <TableHead>Đã xếp chỗ</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell>{table.maxSeats} ghế</TableCell>
                <TableCell>{table.currentSeats} ghế</TableCell>
                <TableCell>{table.description || "—"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(table.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
