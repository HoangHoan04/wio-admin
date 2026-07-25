import { formatDateTime } from "@/common/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { CheckCircle2, Clock, MessageCircle, Pin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface WishItem {
  id: string;
  guestName: string;
  content: string;
  isApproved: boolean;
  isPinned: boolean;
  createdAt: string;
  approvedAt?: string;
}

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function WeddingWishesTab({ weddingId }: { weddingId: string }) {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const { showToast } = useToast();

  const fetchWishes = async () => {
    setIsLoading(true);
    try {
      const res = (await rootApiService.post(API_ENDPOINTS.WISH.PAGINATION, {
        skip: 0,
        take: 1000,
        where: { weddingId },
      })) as any;
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
    if (weddingId) fetchWishes();
  }, [weddingId]);

  const filteredWishes = useMemo(() => {
    const list =
      filter === "approved"
        ? wishes.filter((w) => w.isApproved)
        : filter === "pending"
          ? wishes.filter((w) => !w.isApproved)
          : wishes;
    return [...list].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [wishes, filter]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
        <MessageCircle className="size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Chưa có lời chúc nào cho đám cưới này.
        </p>
      </div>
    );
  }

  const approvedCount = wishes.filter((w) => w.isApproved).length;
  const pendingCount = wishes.length - approvedCount;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          label={`Tất cả (${wishes.length})`}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterChip
          label={`Đã duyệt (${approvedCount})`}
          active={filter === "approved"}
          onClick={() => setFilter("approved")}
          icon={<CheckCircle2 className="size-3.5" />}
        />
        <FilterChip
          label={`Chờ duyệt (${pendingCount})`}
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
          icon={<Clock className="size-3.5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredWishes.map((wish) => (
          <Card
            key={wish.id}
            className={`relative overflow-hidden ${wish.isPinned ? "border-amber-300 bg-amber-50/40" : ""}`}
          >
            {wish.isPinned && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Pin className="size-3" />
                Ghim
              </div>
            )}
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(
                    wish.guestName || "?",
                  )}`}
                >
                  {wish.guestName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-foreground">
                      {wish.guestName}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        wish.isApproved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {wish.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDateTime(wish.createdAt)}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                    "{wish.content}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWishes.length === 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Không có lời chúc nào phù hợp với bộ lọc.
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
