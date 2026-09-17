import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { Armchair, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface TableItem {
  id: string;
  name: string;
  maxSeats: number;
  currentSeats: number;
  description?: string;
  createdAt: string;
}

export default function WeddingTablesTab({
  invitationId,
}: {
  invitationId: string;
}) {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const res = (await rootApiService.post(API_ENDPOINTS.TABLE.PAGINATION, {
        skip: 0,
        take: 100,
        where: { invitationId },
      })) as any;
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
    if (invitationId) fetchTables();
  }, [invitationId]);

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
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
        <Armchair className="size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Chưa có bàn tiệc nào được tạo cho đám cưới này.
        </p>
      </div>
    );
  }

  const totalTables = tables.length;
  const totalMax = tables.reduce((sum, t) => sum + t.maxSeats, 0);
  const totalFilled = tables.reduce((sum, t) => sum + t.currentSeats, 0);
  const fillRate =
    totalMax > 0 ? Math.round((totalFilled / totalMax) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng số bàn"
          value={totalTables}
          icon={<Armchair className="size-4" />}
        />
        <StatCard
          label="Sức chứa"
          value={`${totalMax} ghế`}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Đã xếp chỗ"
          value={`${totalFilled}/${totalMax} (${fillRate}%)`}
          icon={<Users className="size-4" />}
          accent={fillRate >= 90 ? "text-rose-600" : "text-emerald-600"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => {
          const percent =
            table.maxSeats > 0
              ? Math.min(
                  100,
                  Math.round((table.currentSeats / table.maxSeats) * 100),
                )
              : 0;
          const isFull = table.currentSeats >= table.maxSeats;
          return (
            <Card
              key={table.id}
              className="group relative overflow-hidden transition hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Armchair className="size-4.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {table.name}
                      </p>
                      {table.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {table.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(table.id)}
                    className="size-7 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Chỗ ngồi</span>
                    <span
                      className={`font-semibold ${isFull ? "text-rose-600" : "text-foreground"}`}
                    >
                      {table.currentSeats}/{table.maxSeats}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull
                          ? "bg-rose-500"
                          : percent > 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-lg font-bold ${accent || "text-foreground"}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
