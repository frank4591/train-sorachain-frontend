
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { BlurredCard } from "@/components/ui/blurred-card";
import { FileCode, Download, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ConfigFile = {
  id: string;
  task_id: string;
  file_name: string;
  file_content: string;
  cli_command?: string;
};

type ConfigFileDisplayProps = {
  taskId: string;
};

export default function ConfigurationFileDisplay({ taskId }: ConfigFileDisplayProps) {
  const { user } = useAuth();
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && taskId) {
      fetchConfigFiles();
    }
  }, [user, taskId]);

  const fetchConfigFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('configuration_files')
        .select('*')
        .eq('task_id', taskId);
        
      if (error) throw error;
      
      if (data) {
        setConfigFiles(data as ConfigFile[]);
      }
    } catch (error) {
      console.error("Error fetching config files:", error);
      toast.error("Failed to load configuration files");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (file: ConfigFile) => {
    const blob = new Blob([file.file_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <BlurredCard>
        <div className="p-4">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </BlurredCard>
    );
  }

  if (configFiles.length === 0) {
    return (
      <BlurredCard>
        <div className="p-6 text-center">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Configuration Files</h3>
          <p className="text-muted-foreground">
            This task doesn't have any configuration files yet.
          </p>
        </div>
      </BlurredCard>
    );
  }

  return (
    <BlurredCard>
      <div className="p-6">
        <h3 className="text-xl font-medium mb-4">Configuration Files</h3>
        
        <Accordion type="single" collapsible className="space-y-2">
          {configFiles.map((file) => (
            <AccordionItem key={file.id} value={file.id} className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center">
                  <FileCode className="h-4 w-4 mr-2 text-primary" />
                  <span>{file.file_name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="bg-muted/50 p-4 overflow-x-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{file.file_content}</pre>
                </div>
                
                {file.cli_command && (
                  <div className="px-4 py-3 border-t border-border">
                    <div className="flex items-center mb-2">
                      <Terminal className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">CLI Command</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <code className="text-sm font-mono">{file.cli_command}</code>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end p-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadFile(file)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </BlurredCard>
  );
}
