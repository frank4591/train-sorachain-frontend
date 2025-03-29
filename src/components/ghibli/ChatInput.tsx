import { useState, useRef } from "react";
import { ImagePlus, SendHorizontal, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ChatInputProps {
  onSubmit: (message: string, imageFile: File | null) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSubmit, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (isLoading || disabled) return;
    
    if (!imageFile) {
      toast.error("Please upload an image to generate Ghibli art");
      return;
    }
    
    onSubmit(message, imageFile);
    setMessage("");
    // Keep the image for the next generation
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      {imagePreview && (
        <div className="mb-4 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-32 object-cover rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || disabled}
        >
          <ImagePlus className="h-4 w-4" />
          <span className="sr-only">Upload image</span>
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        
        <div className="flex-1 relative">
          <Textarea
            placeholder="Enter a description for your Ghibli art..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-12 resize-none min-h-[60px] max-h-32"
            disabled={isLoading || disabled}
          />
          <div className="absolute right-2 bottom-2 flex flex-col justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${
                message.trim() === "" ? "opacity-50" : ""
              }`}
              onClick={handleSubmit}
              disabled={(!message.trim() && !imageFile) || isLoading || disabled}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
