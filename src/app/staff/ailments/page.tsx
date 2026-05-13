"use client";

import { useAilments } from "@/hooks/use-ailments";
import { useCreateAilment, useUpdateAilment, useDeleteAilment } from "@/hooks/use-crud";
import { SeverityBadge } from "@/components/SeverityBadge";
import { CrudPage } from "@/components/CrudPage";

type AilmentItem = {
  id: number;
  name: string;
  description: string | null;
  severity: "mild" | "moderate" | "severe";
  category: string;
};

type AilmentFormData = {
  name: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
  category: string;
};

const emptyForm: AilmentFormData = { name: "", description: "", severity: "mild", category: "" };

export default function StaffAilmentsPage() {
  const { data: ailments, isLoading, error } = useAilments();
  const createAilment = useCreateAilment();
  const updateAilment = useUpdateAilment();
  const deleteAilment = useDeleteAilment();

  return (
    <CrudPage
      title="Manage Ailments"
      entityName="ailments"
      data={ailments}
      isLoading={isLoading}
      error={error}
      onSave={async (data) => {
        if (data.id) {
          await updateAilment.mutateAsync({ id: data.id, ...data } as AilmentFormData & {
            id: number;
          });
        } else {
          await createAilment.mutateAsync(data as AilmentFormData);
        }
      }}
      onDelete={async (id) => {
        await deleteAilment.mutateAsync(id);
      }}
      isSaving={createAilment.isPending || updateAilment.isPending}
      isDeleting={deleteAilment.isPending}
      emptyForm={emptyForm}
      renderItem={(a) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="font-medium truncate">{(a as AilmentItem).name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {(a as AilmentItem).category}
            </div>
          </div>
          <SeverityBadge severity={(a as AilmentItem).severity} />
        </div>
      )}
      renderForm={(form, onChange) => {
        const f = form as AilmentFormData;
        return (
          <>
            <div>
              <label htmlFor="ailment-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="ailment-name"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={f.name}
                onChange={(e) => onChange({ ...f, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="ailment-category" className="text-sm font-medium">
                Category
              </label>
              <input
                id="ailment-category"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={f.category}
                onChange={(e) => onChange({ ...f, category: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="ailment-severity" className="text-sm font-medium">
                Severity
              </label>
              <select
                id="ailment-severity"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={f.severity}
                onChange={(e) =>
                  onChange({ ...f, severity: e.target.value as "mild" | "moderate" | "severe" })
                }
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div>
              <label htmlFor="ailment-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="ailment-description"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm min-h-[80px]"
                value={f.description}
                onChange={(e) => onChange({ ...f, description: e.target.value })}
              />
            </div>
          </>
        );
      }}
    />
  );
}
