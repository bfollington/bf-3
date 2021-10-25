let zzfx = (...whatever: any) => {};

if (process.browser) {
  zzfx = require("zzfx").zzfx;
}

export const boot = () =>
  zzfx(
    ...[
      0.6,
      ,
      532,
      ,
      0.12,
      0.19,
      1,
      0.93,
      ,
      ,
      -740,
      0.05,
      0.03,
      ,
      ,
      ,
      ,
      0.98,
      0.05,
    ]
  ); // Pickup 116

export const blip = (index = 0) =>
  zzfx(
    ...[
      0.2,
      ,
      45,
      0.01,
      0.01,
      0.01,
      ,
      1.3,
      -3.8,
      ,
      -2250 - index * 48,
      ,
      ,
      ,
      ,
      ,
      ,
      0.32,
      0.02,
    ]
  ); // Blip 114

export const select = () =>
  zzfx(
    ...[
      1.4,
      ,
      1296,
      ,
      0.05,
      0.22,
      1,
      1.97,
      ,
      ,
      -736,
      0.04,
      0.09,
      ,
      ,
      0.1,
      0.07,
      0.65,
      0.02,
    ]
  ); // Pickup 151
