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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTemplateDto } from "@/dto/template.dto";
import { useCreateTemplate } from "@/hooks/template";
import { useRouter } from "@/routes/hooks";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export default function AddTemplatePage() {
  const router = useRouter();
  const { onCreateTemplate, isLoading } = useCreateTemplate();

  const [form, setForm] = useState<CreateTemplateDto>({
    name: "",
    description: "",
    themeCode: "",
    isShow: true,
    isPremium: false,
    minPlan: "FREE",
    trialDays: 0,
  });

  const handleChange = (field: keyof CreateTemplateDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onCreateTemplate(form);
    router.push(ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.path);
  };

  return (
    <BaseView>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-xl font-bold">Thêm template mới</h1>
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
                Lưu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseView>
  );
}
