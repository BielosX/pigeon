import { DayPicker } from "@daypicker/react";
import { type DateRange } from "@daypicker/react";
import { useCallback, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  type SubmitHandler,
  useForm,
  type ValidateResult,
} from "react-hook-form";

interface FormInputs {
  timeStart: string;
  timeEnd: string;
}

export interface DataRangeDropdownOutput {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
}

interface DataRangeDropdownProps {
  id: string;
  positionAnchor: string;
  onApply: (state: DataRangeDropdownOutput) => void;
}

const parseTime = (time: string): number[] => {
  return time.split(":").map((t) => parseInt(t));
};

const toOutput = (
  input: FormInputs,
  selected?: DateRange,
): DataRangeDropdownOutput => {
  const [startHour, startMinute] = parseTime(input.timeStart);
  const [endHour, endMinute] = parseTime(input.timeEnd);
  if (!selected) {
    return {
      start: dayjs().hour(startHour).minute(startMinute),
      end: dayjs().hour(endHour).minute(endMinute),
    };
  }
  const selectedFrom = selected.from!;
  const selectedTo = selected.to!;
  return {
    start: dayjs(selectedFrom).hour(startHour).minute(startMinute),
    end: dayjs(selectedTo).hour(endHour).minute(endMinute),
  };
};

export const DataRangeDropdown = ({
  id,
  positionAnchor,
  onApply,
}: DataRangeDropdownProps) => {
  const [selected, setSelected] = useState<DateRange | undefined>();
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const EndBeforeStartMsg = "End is before Start";

  const onSubmit: SubmitHandler<FormInputs> = useCallback(
    (data) => {
      onApply(toOutput(data, selected));
      ref.current?.hidePopover();
    },
    [selected],
  );

  const validateTimeEnd = useCallback(
    (value: string, formValues: FormInputs): ValidateResult => {
      const [startHour, startMinute] = parseTime(formValues.timeStart);
      const [endHour, endMinute] = parseTime(value);
      if (!selected || selected.from === selected.to) {
        if (startHour > endHour) {
          return EndBeforeStartMsg;
        }
        if (startHour === endHour && startMinute > endMinute) {
          return EndBeforeStartMsg;
        }
      }
      return true;
    },
    [selected],
  );

  return (
    <div
      id={id}
      ref={ref}
      popover="auto"
      className="dropdown bg-white shadow-md rounded-md p-6 flex flex-col"
      style={{
        positionAnchor,
      }}
    >
      <DayPicker
        animate
        mode="range"
        selected={selected}
        onSelect={(s) => setSelected(s)}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="input mt-2 bg-white">
            <span className="label">Start</span>
            <input
              type="time"
              className="input"
              {...register("timeStart", { required: "Start is required" })}
            />
          </label>
          <p
            className={`text-error ${!errors.timeStart ? "hidden" : "visible"}`}
          >
            {errors.timeStart?.message}
          </p>
        </fieldset>
        <fieldset className="fieldset">
          <label className="input bg-white">
            <span className="label">End&nbsp;</span>
            <input
              type="time"
              className="input"
              {...register("timeEnd", {
                required: "End is required",
                validate: validateTimeEnd,
              })}
            />
          </label>
          <p className={`text-error ${!errors.timeEnd ? "hidden" : "visible"}`}>
            {errors.timeEnd?.message}
          </p>
        </fieldset>
        <div className="flex flex-row justify-end mt-6">
          <button
            className="btn mr-2"
            onClick={() => ref.current?.hidePopover()}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};
