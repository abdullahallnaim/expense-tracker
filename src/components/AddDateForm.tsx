import { useState } from "react";
import { CalendarPlus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AddDateFormProps {
  onAdd: (date: string) => void;
}

const bengaliDigits = "০১২৩৪৫৬৭৮৯";
const toBn = (s: string) => s.replace(/[0-9]/g, (d) => bengaliDigits[parseInt(d)]);

const AddDateForm = ({ onAdd }: AddDateFormProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const { t, lang, fmtNum } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    // Stored format: D.M.YY (Bengali numerals to stay compatible with existing parser)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    const stored = toBn(`${day}.${month}.${year}`);
    onAdd(stored);
    setDate(undefined);
  };

  const display = date
    ? lang === "bn"
      ? fmtNum(format(date, "d.M.yy"))
      : format(date, "d MMM yyyy")
    : t("pickDate");

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "input-field flex-1 justify-start text-left font-normal text-lg",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            {display}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      <Button type="submit" className="add-button gap-2 px-5" disabled={!date}>
        <CalendarPlus className="h-5 w-5" />
        <span className="hidden sm:inline">{t("addDate")}</span>
      </Button>
    </form>
  );
};

export default AddDateForm;
