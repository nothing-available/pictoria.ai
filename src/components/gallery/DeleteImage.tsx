import { deleteImage } from "@/actions/image-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteImageProps {
  imageId: string;
  onDelete?: () => void;
  className?: string;
  imageName: string;
}

export function DeleteImage({ imageId, className, onDelete, imageName }: DeleteImageProps) {
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting image...");
    
    try {
      const { error, success } = await deleteImage(imageId, imageName);
      
      if (error) {
        toast.error(error, { id: toastId });
      } else if (success) {
        toast.success("Image deleted successfully", { id: toastId });
        onDelete?.();
      }
    } catch {
      toast.dismiss(toastId);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className={cn("gap-2", className)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="z-[999]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{imageName}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}