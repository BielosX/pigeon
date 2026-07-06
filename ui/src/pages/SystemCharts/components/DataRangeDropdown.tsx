import { DayPicker } from "@daypicker/react";
import { type DateRange } from "@daypicker/react";
import { useRef, useState } from "react";
import dayjs from "dayjs";

interface DataRangeDropdownState {
  selected: DateRange | undefined;
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

const toOutput = (state: DataRangeDropdownState): DataRangeDropdownOutput => {
  const [startHour, startMinute] = state.timeStart
    .split(":")
    .map((t) => parseInt(t));
  const [endHour, endMinute] = state.timeEnd.split(":").map((t) => parseInt(t));
  if (!state.selected) {
    return {
      start: dayjs().hour(startHour).minute(startMinute),
      end: dayjs().hour(endHour).minute(endMinute),
    };
  }
  const selectedFrom = state.selected.from!;
  const selectedTo = state.selected.to!;
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
  const [state, setState] = useState<DataRangeDropdownState>(() => {
    const now = dayjs();
    const formatted = now.format("HH:mm");
    return {
      selected: {
        from: now.toDate(),
        to: now.toDate(),
      },
      timeStart: formatted,
      timeEnd: formatted,
    };
  });
  const ref = useRef<HTMLDivElement | null>(null);
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
        selected={state.selected}
        onSelect={(s) =>
          setState({
            ...state,
            selected: s,
          })
        }
      />
      <label className="input mb-2 mt-2 bg-white">
        <span className="label">Start</span>
        <input
          type="time"
          className="input"
          value={state.timeStart}
          onInput={(e) => setState({ ...state, timeStart: e.data })}
        />
      </label>
      <label className="input bg-white">
        <span className="label">End&nbsp;</span>
        <input
          type="time"
          className="input"
          value={state.timeEnd}
          onInput={(e) => setState({ ...state, timeEnd: e.data })}
        />
      </label>
      <div className="flex flex-row justify-end mt-6">
        <button className="btn mr-2" onClick={() => ref.current?.hidePopover()}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            onApply(toOutput(state));
            ref.current?.hidePopover();
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
