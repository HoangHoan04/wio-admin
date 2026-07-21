import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/services/endpoint";
import rootApiService from "@/services/api.service";
import { useToast } from "@/store/toastStore";
import { FileCode, Pencil, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface EnvFileItem {
  project: string;
  environment: string;
  path: string;
  updatedAt: string;
  content?: string;
}

const PROJECT_ORDER = ['wio-api', 'wio-admin', 'wio-customer'];

export default function EnvManagerPage() {
  const { showToast } = useToast();
  const [files, setFiles] = useState<EnvFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<EnvFileItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await rootApiService.get<EnvFileItem[]>(
        API_ENDPOINTS.ENV_MANAGER.FILES,
      );
      setFiles(data);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error.message || "Không thể tải danh sách env files",
        timeout: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (file: EnvFileItem) => {
    try {
      const data = await rootApiService.get<EnvFileItem>(
        API_ENDPOINTS.ENV_MANAGER.FILE(file.project, file.environment),
      );
      setSelected(data);
      setEditContent(data.content || "");
      setDialogOpen(true);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error.message || "Không thể đọc env file",
        timeout: 5000,
      });
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await rootApiService.put(
        API_ENDPOINTS.ENV_MANAGER.FILE(selected.project, selected.environment),
        { content: editContent },
      );
      showToast({
        type: "success",
        title: "Thành công",
        message: `Đã cập nhật ${selected.project}/${selected.environment}`,
      });
      setDialogOpen(false);
      fetchFiles();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error.message || "Không thể lưu env file",
        timeout: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const getProjectLabel = (project: string) => {
    const map: Record<string, string> = {
      "wio-admin": "WIO Admin",
      "wio-customer": "WIO Customer",
      "wio-api": "WIO API",
    };
    return map[project] || project;
  };

  const orderedFiles = [...files].sort(
    (a, b) => PROJECT_ORDER.indexOf(a.project) - PROJECT_ORDER.indexOf(b.project),
  );

  return (
    <BaseView>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Quản lý biến môi trường</h1>
          <p className="text-sm text-muted-foreground">
            Chỉnh sửa file .env duy nhất của các services trên server.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchFiles}
          disabled={loading}
        >
          <RefreshCw
            className={`size-4 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Dự án</th>
                <th className="px-4 py-3 text-left font-medium">Đường dẫn</th>
                <th className="px-4 py-3 text-left font-medium">Cập nhật lần cuối</th>
                <th className="px-4 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orderedFiles.map((file) => (
                <tr
                  key={`${file.project}-${file.environment}`}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">
                    {getProjectLabel(file.project)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {file.path}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {file.updatedAt && new Date(file.updatedAt).getTime() > 0
                      ? new Date(file.updatedAt).toLocaleString("vi-VN")
                      : "Chưa có"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(file)}
                    >
                      <Pencil className="size-4" />
                      Sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCode className="size-5" />
              Chỉnh sửa env
            </DialogTitle>
            <DialogDescription>
              {selected && <span>{getProjectLabel(selected.project)}</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Đường dẫn: {selected?.path}
            </p>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[400px] font-mono text-xs"
              placeholder="# KEY=VALUE"
            />
            <p className="text-xs text-destructive">
              Lưu ý: wio-api chỉ cần restart container. wio-admin/wio-customer
              cần rebuild image vì biến build-time được bake vào static file.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="size-4" />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseView>
  );
}
