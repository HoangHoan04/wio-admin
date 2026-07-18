import { enumData } from "@/common/enums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/store/toastStore";
import {
  Download,
  Eye,
  FileText,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import React, { useRef, useState } from "react";

interface UploadFileItem {
  uid: string;
  name: string;
  url: string;
  file?: File;
}

interface UploadFileDto {
  id?: string;
  fileUrl: string;
  fileName?: string;
}

interface FileUploadProps {
  label?: string;
  required?: boolean;
  type?: "document" | "image" | "all";
  maxSize?: number;
  onFileUploaded?: (url: UploadFileDto[] | UploadFileDto | null) => void;
  initValue?: UploadFileDto | UploadFileDto[] | string | null;
  mode?: "single" | "multi";
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const mapInitValueToFileList = (
  initValue?: FileUploadProps["initValue"],
  mode: "single" | "multi" = "single",
): UploadFileItem[] => {
  if (!initValue || initValue === "") return [];
  const values = Array.isArray(initValue) ? initValue : [initValue];
  const targetValues =
    mode === "multi"
      ? values
      : values.length > 0
        ? [values[values.length - 1]]
        : [];

  return targetValues
    .filter(
      (item): item is UploadFileDto =>
        !!item && typeof item === "object" && !!item.fileUrl,
    )
    .map((item) => ({
      uid: item.id || `file-${Date.now()}-${Math.random()}`,
      name: item.fileName || "file",
      url: item.fileUrl,
    }));
};

const mapFileListToDto = (fileList: UploadFileItem[]): UploadFileDto[] =>
  fileList.map((file) => ({
    id: file.uid,
    fileUrl: file.url,
    fileName: file.name,
  }));

const getAcceptType = (type: FileUploadProps["type"]): string => {
  switch (type) {
    case "document":
      return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
    case "image":
      return "image/*";
    default:
      return "*";
  }
};

const useUploadSingle = () => {
  const onUpload = async (formData: FormData) => {
    const file = formData.get("file") as File;
    console.log("Hook Fake - Nhận file từ FormData:", file?.name);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: `mock-${Date.now()}`,
      fileUrl: "https://picsum.photos/200",
    };
  };

  return { onUpload };
};
export default function FileUploadCustom({
  label,
  required = false,
  type = "image",
  maxSize = enumData.maxSizeUpload,
  onFileUploaded,
  style,
  className,
  initValue,
  mode = "single",
  disabled = false,
}: FileUploadProps) {
  const { onUpload } = useUploadSingle();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileList, setFileList] = useState<UploadFileItem[]>(() =>
    mapInitValueToFileList(initValue, mode),
  );
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<UploadFileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const triggerChange = (newFiles: UploadFileItem[]) => {
    if (onFileUploaded) {
      const dtos = mapFileListToDto(newFiles);
      onFileUploaded(mode === "multi" ? dtos : dtos[0] || null);
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size / 1024 / 1024 >= maxSize) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: `Tệp tin quá lớn. Vui lòng chọn tệp tin nhỏ hơn ${maxSize} MB.`,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await onUpload(formData);

      if (response) {
        const newItem: UploadFileItem = {
          uid: response.id || `new-${Date.now()}`,
          name: file.name,
          url: response.fileUrl,
          file: file,
        };

        let newFileList: UploadFileItem[] = [];
        setFileList((prev) => {
          if (mode === "single") {
            newFileList = [newItem];
          } else {
            newFileList = [...prev, newItem];
          }
          return newFileList;
        });

        triggerChange(mode === "single" ? [newItem] : [...fileList, newItem]);

        showToast({
          type: "success",
          title: "Thành công",
          message: "Tệp tin đã được tải lên thành công.",
          timeout: 2000,
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Tải lên tệp tin thất bại.",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (uid: string) => {
    const newFiles = fileList.filter((item) => item.uid !== uid);
    setFileList(newFiles);
    triggerChange(newFiles);
  };

  const isImageCheck = (urlOrName: string) => {
    return (
      /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(urlOrName) || type === "image"
    );
  };

  const showUploadBtn =
    !disabled && (mode === "multi" || fileList.length === 0);

  const boxSizeClass = "w-32 h-32 min-w-[128px] min-h-[128px]";

  return (
    <div className={cn("flex flex-col gap-2", className)} style={style}>
      {label && (
        <label className="text-sm font-semibold ">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-4">
        {fileList.map((item) => (
          <div
            key={item.uid}
            className={cn(
              boxSizeClass,
              "group relative rounded-lg border border-border overflow-hidden shadow-sm bg-muted/35",
            )}
          >
            <div className="w-full h-full flex items-center justify-center ">
              {isImageCheck(item.url || item.name) ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                  <FileText className="w-8 h-8 mb-1" />
                  <span className="text-[10px] w-full break-all line-clamp-2">
                    {item.name}
                  </span>
                </div>
              )}
            </div>

            {!disabled && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                <Button
                  className="w-8 h-8 p-0 rounded-full bg-muted hover:bg-accent text-foreground flex items-center justify-center border-none"
                  onClick={() => {
                    setPreviewImage(item);
                    setIsPreviewOpen(true);
                  }}
                  title="Xem tệp tin"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  className="w-8 h-8 p-0 rounded-full bg-red-950/80 hover:bg-red-900 text-red-400 flex items-center justify-center border-none"
                  onClick={() => handleRemove(item.uid)}
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {showUploadBtn && (
          <div
            className={cn(
              boxSizeClass,
              "relative rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer bg-muted/10 hover:bg-muted/40 hover:border-input transition-colors duration-200",
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptType(type)}
              className="hidden"
              onChange={onFileChange}
              disabled={loading}
            />
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <PlusCircle className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Chọn tệp tin
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {!disabled && showUploadBtn && (
        <div className="text-xs text-muted-foreground">
          {type === "image"
            ? "Chỉ chấp nhận tệp tin hình ảnh"
            : "Chỉ chấp nhận tệp tin tài liệu"}{" "}
          • Tối đa: {maxSize}MB
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md w-125">
          <DialogHeader>
            <DialogTitle>{previewImage?.name || "Xem tệp tin"}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="w-full flex items-center justify-center">
              {isImageCheck(previewImage.url) ? (
                <img
                  src={previewImage.url}
                  alt={previewImage.name}
                  className="max-w-full max-h-[70vh] object-contain shadow-lg rounded border border-border"
                />
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="font-bold text-lg text-foreground mb-4">
                    {previewImage.name}
                  </p>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open(previewImage.url, "_blank")}
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải về</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
