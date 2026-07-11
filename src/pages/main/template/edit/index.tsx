import { ROUTES } from "@/common/constants";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateTemplateDto } from "@/dto/template.dto";
import { useTemplateDetail, useUpdateTemplate } from "@/hooks/template";
import { useRouter } from "@/routes/hooks";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading: isLoadingDetail } = useTemplateDetail(id);
  const { onUpdateTemplate, isLoading } = useUpdateTemplate();

  const [form, setForm] = useState<UpdateTemplateDto>({
    id: id || "",
    name: "",
    description: "",
    themeCode: "",
    isShow: true,
    isPremium: false,
    minPlan: "FREE",
    trialDays: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: id || "",
        name: data.name || "",
        description: data.description || "",
        themeCode: data.themeCode || "",
        isShow: data.isShow ?? true,
        isPremium: data.isPremium ?? false,
        minPlan: data.minPlan || "FREE",
        trialDays: data.trialDays ?? 0,
      });
    }
  }, [data, id]);

  const handleChange = (field: keyof UpdateTemplateDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onUpdateTemplate(form);
    router.push(ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.path);
  };

  if (isLoadingDetail) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-xl font-bold">Chỉnh sửa template</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin template</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên template</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="themeCode">Mã theme</Label>
              <Input
                id="themeCode"
                value={form.themeCode}
                onChange={(e) => handleChange("themeCode", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minPlan">Gói tối thiểu</Label>
                <Select
                  value={form.minPlan}
                  onValueChange={(val) => handleChange("minPlan", val)}
                >
                  <SelectTrigger id="minPlan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="trialDays">Ngày dùng thử</Label>
                <Input
                  id="trialDays"
                  type="number"
                  value={form.trialDays}
                  onChange={(e) =>
                    handleChange("trialDays", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  id="isShow"
                  checked={form.isShow}
                  onCheckedChange={(val) => handleChange("isShow", val)}
                />
                <Label htmlFor="isShow">Hiển thị</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isPremium"
                  checked={form.isPremium}
                  onCheckedChange={(val) => handleChange("isPremium", val)}
                />
                <Label htmlFor="isPremium">Premium</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="gap-1.5"
              >
                <Save className="size-4" />
                Cập nhật
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseView>
  );
}
