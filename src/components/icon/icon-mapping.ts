import { Mic } from "./svg/mic";
import { MicOff } from "./svg/mic-off";
import { Search } from "./svg/search";

const ICON_MAPPING = {
  mic: Mic,
  "mic-off": MicOff,
  search: Search,
};

type IconName = keyof typeof ICON_MAPPING;

export { ICON_MAPPING, type IconName };
