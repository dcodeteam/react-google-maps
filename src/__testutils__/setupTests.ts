import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import maps from "./mapsMock";

enzyme.configure({ adapter: new Adapter() });

Object.defineProperties(window, { google: { value: { maps } } });
