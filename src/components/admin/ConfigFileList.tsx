
import { FileCode, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/blurred-card";

interface ConfigFileListProps {
  configFiles: any[];
  tasks: any[];
}

export const ConfigFileList = ({ configFiles, tasks }: ConfigFileListProps) => {
  if (configFiles.length === 0) {
    return (
      <BlurredCard>
        <div className="p-8 text-center">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Configuration Files Yet</h3>
          <p className="text-muted-foreground mb-6">
            Add configuration files to your tasks to provide participants with necessary setup.
          </p>
          <Button onClick={() => document.querySelector('[data-add-config]')?.click()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Config File
          </Button>
        </div>
      </BlurredCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {configFiles.map((file) => {
        const relatedTask = tasks.find(t => t.id === file.task_id);
        return (
          <BlurredCard key={file.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium">{file.file_name}</h3>
                  <p className="text-muted-foreground">
                    For task: {relatedTask?.title || 'Unknown Task'}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md overflow-x-auto mb-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">{file.file_content}</pre>
              </div>
              
              {file.cli_command && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">CLI Command</p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <code className="text-sm font-mono">{file.cli_command}</code>
                  </div>
                </div>
              )}
            </div>
          </BlurredCard>
        );
      })}
    </div>
  );
};
