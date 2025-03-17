
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserRole, ROLES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  className?: string;
}

export default function RoleSelector({ selectedRole, onSelectRole, className }: RoleSelectorProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {ROLES.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          isSelected={selectedRole === role.id}
          onSelect={() => onSelectRole(role.id)}
        />
      ))}
    </div>
  );
}

interface RoleCardProps {
  role: typeof ROLES[number];
  isSelected: boolean;
  onSelect: () => void;
}

function RoleCard({ role, isSelected, onSelect }: RoleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "rounded-xl p-6 cursor-pointer transition-all duration-300 border-2",
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/30 hover:bg-primary/5"
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{role.name}</h3>
        {isSelected && (
          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
    </motion.div>
  );
}

<lov-add-dependency>framer-motion@latest</lov-add-dependency>
