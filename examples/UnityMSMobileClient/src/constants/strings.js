// Routes
// Holds all constant strings
export const RouteNames = {
  BottomTabStack: 'BottomTabStack',
  SideDrawer: 'SideDrawer',
  Home: 'Home',
  Profile: 'Profile',
  Settings: 'Settings',
  Societies: 'Societies',
  MemberSocietyInfo: 'MemberSocietyInfo',
  Members: 'Members',
  Requests: 'Requests',
  Initialize: 'Initialize',
  SignIn: 'SignIn',
  SignUp: 'SignUp',
  SwitchUser: 'SwitchUser',
  ForgotPassword: 'ForgotPassword',
  VerifyOTP: 'VerifyOTP',
  DeeplinkHandler: 'DeeplinkHandler',
  NewPassword: 'NewPassword',
  CreateOrEditRecord: 'CreateOrEditRecord',
  CreateOrEditCreditType: 'CreateOrEditCreditType',
  CreateOrEditCostType: 'CreateOrEditCostType',
  RecordAccounts: 'RecordAccounts',
  MemberInfo: 'MemberInfo',
  RecordTypes: 'RecordTypes',
  BlockedMembers: 'BlockedMembers',
  SocietyAnalytics: 'SocietyAnalytics',
  MemberAnalytics: 'MemberAnalytics',
  EventTypes: 'EventTypes',
  EditSocietyProfile: 'EditSocietyProfile',
  EditMemberProfile: 'EditMemberProfile',
  PaidAccountAmountHistory: 'PaidAccountAmountHistory',
  CreateOrEditPaidAmount: 'CreateOrEditPaidAmount',
  Events: 'Events',
  PaidAmountHistory: 'PaidAmountHistory',
  CreateOrEditEvent: 'CreateOrEditEvent',
  EventAccounts: 'EventAccounts',
  Reports: 'Reports',
};

export const RouteLabels = {
  MemberSocietyInfo: 'Society',
  PaidAmountHistory: 'History',
};

// Keys
export const PersistorKeys = {
  application: 'application',
  auth: 'auth',
  root: 'root',
};
export const HeaderKeys = {
  authorization: 'Authorization',
};
export const AsyncStorageKeys = {
  authorizationToken: 'token',
};
export const UserKeys = {
  _id: '_id',
  email: 'email',
  name: 'name',
  password: 'password',
  userType: 'userType',
  expiredAfter: 'expiredAfter',
  defaultAccount: 'defaultAccount',
  token: 'token',
  avatar: 'avatar',
  uri: 'uri',
};

export const SocietyKeys = {
  _id: '_id',
  accounts: 'accounts',
};
export const AuthKeys = {
  authState: 'authState',
  loggedInUsers: 'loggedInUsers',
};

export const RecordKeys = {
  _id: '_id',
  amount: 'amount',
  description: 'description',
  type: 'typeId',
  accounts: 'accounts',
  date: 'date',
};

export const AmountHistoryKeys = {
  amount: 'amount',
  description: 'description',
  date: 'date',
};

export const EventKeys = {
  _id: '_id',
  title: 'title',
  organizer: 'organizerId',
  date: 'date',
  accounts: 'accounts',
  description: 'description',
};

export const AccountKeys = {
  _id: '_id',
  blocked: 'blocked',
};

export const TypeKeys = {
  name: 'name',
};

export const AwsKeys = {
  file: 'file',
};

export const AxiosKeys = {
  contentType: 'Content-Type',
};

export const DocumentKeys = {
  _id: '_id',
};

// Types
export const MediaTypes = {
  photo: 'photo',
  video: 'video',
  mixed: 'mixed',
};
export const IconTypes = {
  default: 'FontAwesome5',
  Ionicons: 'Ionicons',
  EvilIcons: 'EvilIcons',
  SimpleLineIcons: 'SimpleLineIcons',
  Feather: 'FeatherIcons',
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  EntypoIcon: 'EntypoIcon',
  FontAwesome: 'FontAwesome',
  FontAwesome5: 'FontAwesome5',
};
export const KeyboardTypes = {
  default: 'default',
  numeric: 'numeric',
};
export const UserTypes = {
  Member: 'Member',
  Society: 'Society',
  Unknown: 'Unknown',
};

export const CommonVariableTypes = {
  boolean: 'boolean',
  string: 'string',
  function: 'function',
};

export const DisplayTypes = {
  flex: 'flex',
  none: 'none',
};

export const BackgroundColorTypes = {
  transparent: 'transparent',
};

export const PickerModeTypes = {
  simple: 'SIMPLE',
  badge: 'BADGE',
};

export const ListModeTypes = {
  DEFAULT: 'DEFAULT',
  SCROLLVIEW: 'SCROLLVIEW',
  FLATLIST: 'FLATLIST',
  MODAL: 'MODAL',
};

export const TokenTypes = {
  resetMemberPassword: 'resetMemberPassword',
  resetSocietyPassword: 'resetSocietyPassword',
};

export const KeyboardShouldPersistTypes = {
  handled: 'handled',
};

export const ViewShotResultTypes = {
  dataUri: 'data-uri',
};

// Validations
export const DateTimeFormats = {
  yearMonthDate: 'YYYY/MM/DD',
};
export const ValidationModes = {
  onBlur: 'onBlur',
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onTouched: 'onTouched',
  all: 'all',
};

export const Patterns = {
  authorizationHeader: 'Bearer {BearerToken}',
  rgb: 'rgb({R},{G},{B})',
  currency: '{Amount} Rs',
  multipliedBy: 'x{Count}',
  graphqlReference: '{Schema}:{Id}',
  loggedInUserTokenKey: `${AsyncStorageKeys.authorizationToken}:{Reference}`,
  bracketCountPlus: '({Count}+)',
  bracketCount: '({Count})',
  reportsName: 'Reports({From}to{To})',
  filePath: 'file://{Path}',
};

export const ReplaceableTokens = {
  bearerToken: '{BearerToken}',
  r: '{R}',
  g: '{G}',
  b: '{B}',
  amount: '{Amount}',
  count: '{Count}',
  slash: '/',
  schema: '{Schema}',
  id: '{Id}',
  reference: '{Reference}',
  from: '{From}',
  to: '{To}',
  path: '{Path}',
};

// Values

export const MomentUnitOfTimes = {
  seconds: 'seconds',
  milliseconds: 'milliseconds',
  days: 'days',
  day: 'day',
  week: 'week',
  year: 'year',
  month: 'month',
};

export const CompatibilityJSONVersions = {
  v3: 'v3',
};

export const Languages = {
  english: 'english',
  tamil: 'tamil',
};
export const SliceNames = {
  application: 'application',
  auth: 'auth',
  counter: 'counter',
};
export const fetchPolicyValues = {
  noCache: 'no-cache',
  networkOnly: 'network-only',
  cacheAndNetwork: 'cache-and-network',
};
export const AppStateStatuses = {
  active: 'active',
  inactive: 'inactive',
};
export const IconNames = {
  home: 'home',
  person: 'person',
  checkBox: 'check-box',
  check: 'check',
  checkBoxOutlineBlank: 'check-box-outline-blank',
  calendarAlt: 'calendar-alt',
  eye: 'eye',
  eyeSlash: 'eye-slash',
  cloudOffline: 'cloud-offline',
  addCircle: 'add-circle',
  userPlus: 'user-plus',
  plus: 'plus',
  plusCircle: 'plus-circle',
  navigateNext: 'navigate-next',
  removeCircle: 'remove-circle',
  userMinus: 'user-minus',
  handsHelping: 'hands-helping',
  users: 'users',
  time: 'time',
  event: 'event',
  table: 'table',
  accountMultiplePlus: 'account-multiple-plus',
  userCheck: 'user-check',
  sync: 'sync',
  delete: 'delete',
  block: 'block',
  accountReactivate: 'account-reactivate',
  minusCircle: 'minus-circle',
  shareAlt: 'share-alt',
  microsoftExcel: 'microsoft-excel',
  fileExcel: 'file-excel',
  filePdf: 'file-pdf',
  checkCircle: 'check-circle',
  edit: 'edit',
  keyboardArrowDown: 'keyboard-arrow-down',
  keyboardArrowUp: 'keyboard-arrow-up',
  closeCircle: 'close-circle',
  history: 'history',
  analytics: 'analytics',
  googleAnalytics: 'google-analytics',
};
export const NativeEvents = {
  // Laptop backspace is not included in this type
  Backspace: 'Backspace',
};
export const AuthStates = {
  authUnInitialized: 'authUnInitialized',
  authLoading: 'authLoading',
  authSuccess: 'authSuccess',
  authFailed: 'authFailed',
};

export const FlexDirections = {
  row: 'row',
  column: 'column',
};

export const FlexWrapOptions = {
  wrap: 'wrap',
};

export const Positions = {
  absolute: 'absolute',
  relative: 'relative',
};

export const FlexAlignments = {
  flexStart: 'flex-start',
  flexEnd: 'flex-end',
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  stretch: 'stretch',
  baseline: 'baseline',
};

export const TextAlignments = {
  center: 'center',
};

export const CommonStrings = {
  empty: '',
  random: 'random',
  zero: '0',
};

export const DeeplinkParams = {
  screen: 'screen',
};

export const DateFormats = {
  default: 'YYYY/MM/DD',
  dateTime: 'YYYY/MM/DD HH:mm',
  sortMonthName: 'MMM',
  yearMonth: 'YYYY/MMM',
  yearMonthDateWithoutSlash: 'YYYYMMDD',
};

export const GraphqlErrorCodes = {
  InternalServerError: 'INTERNAL_SERVER_ERROR',
  Forbidden: 'FORBIDDEN',
};

export const TokenErrorCodes = {
  GetAuthToken: 'GET_AUTH_TOKEN_ERROR',
  GetAuthTokenByReference: 'GET_AUTH_TOKEN_BY_REFERENCE_ERROR',
  SetAuthTokenByReference: 'SET_AUTH_TOKEN_BY_REFERENCE_ERROR',
  SetAuthToken: 'SET_AUTH_TOKEN_ERROR',
  RemoveAuthToken: 'REMOVE_AUTH_TOKEN_ERROR',
  RemoveAuthTokenByReference: 'REMOVE_AUTH_TOKEN_BY_REFERENCE_ERROR',
};

export const NetworkErrorMessages = {
  RequestFailed: 'Network request failed',
};

export const ErrorMessages = {
  UnknownError: 'Unknown error',
};

export const BookCategory = {
  credit: 'credit',
  cost: 'cost',
};

export const ReportCategory = {
  daily: 'daily',
  monthly: 'monthly',
  yearly: 'yearly',
};

export const ReportType = {
  individual: 'individual',
  cumulative: 'cumulative',
};

export const Platforms = {
  android: 'android',
  ios: 'ios',
};

export const Permissions = {
  postNotification: 'android.permission.POST_NOTIFICATIONS',
};

export const NativePermissionStates = {
  granted: 'granted',
};

export const NotificationChannels = [{name: 'Default', id: 'default'}];

export const DropDownDirections = {
  BOTTOM: 'BOTTOM',
};

export const ColorSchemes = {
  dark: 'dark',
  light: 'light',
};

export const SchemaNames = {
  accountWithMember: 'AccountWithMember',
  societyWithAccounts: 'SocietyWithAccounts',
  account: 'Account',
};

export const Themes = {
  orange: 'orange',
  blue: 'blue',
  green: 'green',
  pink: 'pink',
  yellow: 'yellow',
};

export const ActivityIndicatorSizeTypes = {
  large: 'large',
};

export const ComponentNames = {
  AuthTokenProvider: 'AuthTokenProvider',
  Initialize: 'Initialize',
};

// Paths
export const GraphqlPaths = {
  data: 'response',
  __typename: '__typename',
  paginationDto: 'paginationDto',
};

// Directories
export const Directories = {
  documents: 'Documents',
};

// Mongoose not accepting object keys
export const DESC = 'desc';
export const ASC = 'asc';
