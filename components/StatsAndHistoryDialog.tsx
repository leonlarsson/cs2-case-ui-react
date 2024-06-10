"use client";

import Link from "next/link";
import Button from "./Button";
import gradeColors from "@/utils/gradeColors";
import { formatDecimal, formatPercentage } from "@/utils/formatters";
import { GradeType, ItemType } from "@/types";

type Props = {
  historyDialogRef: React.MutableRefObject<HTMLDialogElement | null>;
  unboxedItems: ItemType[];
  setUnboxedItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
};

export default ({ historyDialogRef, unboxedItems, setUnboxedItems }: Props) => {
  return (
    <dialog
      className="mx-auto w-full max-w-lg border-[1px] border-white/30 bg-[#2d2d2d]/50 text-xl text-white backdrop-blur-xl backdrop:bg-black/30 backdrop:backdrop-blur-sm"
      ref={historyDialogRef}
    >
      <div className="flex flex-col">
        <span className="bg-[#262626]/70 p-3 text-3xl font-semibold text-neutral-400">
          Stats and history
        </span>

        <span className="p-2">
          To see a list of the last items unboxed by the entire community, go{" "}
          <Link className="font-semibold hover:underline" href="/unboxed">
            here
          </Link>
          . To see your own, go{" "}
          <Link className="font-semibold hover:underline" href="/inventory">
            here
          </Link>
          .
        </span>

        {/* STATS */}
        <div className="flex flex-col gap-1 p-2">
          <span className="font-semibold underline">Stats</span>

          <span>
            Opened:{" "}
            <span className="font-semibold">
              {unboxedItems.length.toLocaleString("en")}
            </span>
          </span>

          <span>
            Key spend:{" "}
            <span className="font-semibold">
              {formatDecimal(unboxedItems.length * 2.35)}€ ($
              {formatDecimal(unboxedItems.length * 2.5)})
            </span>
          </span>

          {Object.entries(gradeColors)
            .slice(0, 5)
            .map(([grade, color]) => (
              <span
                key={grade}
                className="border-l-4 px-2"
                style={{ borderColor: color }}
              >
                {grade}:{" "}
                <span className="font-semibold">
                  {unboxedItems
                    .filter(x => x.rarity.name === grade)
                    .length.toLocaleString("en")}{" "}
                  <span>
                    (
                    {formatPercentage(
                      unboxedItems.filter(x => x.rarity.name === grade).length /
                        unboxedItems.length,
                    )}
                    )
                  </span>
                </span>
              </span>
            ))}

          {/* Add Covert manually */}
          <span
            className="border-l-4 px-2"
            style={{ borderColor: gradeColors["Covert"] }}
          >
            Covert:{" "}
            <span className="font-semibold">
              {unboxedItems
                .filter(
                  x => x.rarity.name === "Covert" && !x.name.includes("★"),
                )
                .length.toLocaleString("en")}{" "}
              {/* Percentage */}
              <span>
                (
                {formatPercentage(
                  unboxedItems.filter(
                    x => x.rarity.name === "Covert" && !x.name.includes("★"),
                  ).length / unboxedItems.length,
                )}
                )
              </span>
            </span>
          </span>

          {/* Add RSI manually */}
          <span
            className="border-l-4 px-2"
            style={{ borderColor: gradeColors["Rare Special Item"] }}
          >
            Rare Special Item:{" "}
            <span className="font-semibold">
              {unboxedItems
                .filter(x => x.name.includes("★"))
                .length.toLocaleString("en")}{" "}
              {/* Percentage */}
              <span>
                (
                {formatPercentage(
                  unboxedItems.filter(x => x.name.includes("★")).length /
                    unboxedItems.length,
                )}
                )
              </span>
            </span>
          </span>

          <hr className="my-1" />

          {/* LAST 20 ITEMS */}
          <div>
            <div className="font-semibold underline">Last 20 items</div>
            {unboxedItems.length === 0 && <span>No items unboxed yet</span>}
            <div className="flex flex-col gap-1">
              {unboxedItems.slice(0, 20).map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="border-l-4 px-2"
                  style={{
                    borderColor: item.name.includes("★")
                      ? gradeColors["Rare Special Item"]
                      : gradeColors[item.rarity.name as GradeType],
                  }}
                >
                  {item.name} {item?.phase ? ` (${item.phase})` : ""}
                </div>
              ))}
            </div>
          </div>

          {/* COVERTS AND GOLDS */}
          <div>
            <div className="font-semibold underline">Coverts and Golds</div>
            {unboxedItems.filter(
              x => x.rarity.name === "Covert" || x.name.includes("★"),
            ).length === 0 && <span>No items unboxed yet</span>}
            <div className="flex flex-col gap-1">
              {unboxedItems
                .filter(x => x.rarity.name === "Covert" || x.name.includes("★"))
                .map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="border-l-4 px-2"
                    style={{
                      borderColor: item.name.includes("★")
                        ? gradeColors["Rare Special Item"]
                        : gradeColors[item.rarity.name as GradeType],
                    }}
                  >
                    {item.name} {item.phase ? ` (${item.phase})` : ""}
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-3 flex justify-between">
            <Button
              variant="danger"
              onClick={() => {
                setUnboxedItems([]);
                localStorage.setItem("unboxedItemsNew", "[]");
              }}
            >
              CLEAR HISTORY
            </Button>

            <Button
              variant="secondary"
              onClick={() => historyDialogRef.current?.close()}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
