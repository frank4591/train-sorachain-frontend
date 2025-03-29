
import { supabase } from "@/integrations/supabase/client";
import { useSoraRunes } from "@/context/SoraRunesContext";
import { RUNES_PER_SUBMISSION } from "@/lib/sora-constants";
import { toast } from "sonner";
import { UserData } from "@/lib/constants";

export const useShareSubmission = () => {
  const { incrementRunes } = useSoraRunes();

  const handleShareSubmission = async (
    generatedImageUrl: string | null,
    user: UserData | null,
    isAuthenticated: boolean,
    onClose: () => void
  ) => {
    if (!isAuthenticated || !user || !generatedImageUrl) {
      onClose();
      return;
    }
    
    try {
      const { error } = await supabase
        .from('image_submissions')
        .update({ is_public: true })
        .eq('user_id', user.id)
        .eq('output_image', generatedImageUrl);
      
      if (error) throw error;
      
      await incrementRunes(RUNES_PER_SUBMISSION);
      toast.success(`Thank you! You earned ${RUNES_PER_SUBMISSION} SoraRunes`);
      
    } catch (error) {
      console.error('Error sharing submission:', error);
      toast.error('Failed to share submission');
    } finally {
      onClose();
    }
  };

  return { handleShareSubmission };
};
