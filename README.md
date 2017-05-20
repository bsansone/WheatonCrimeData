WheatonCrimeData
=========================

### About
The Wheaton Police Department publishes reports each week outlining crimes and arrests that occurred in Wheaton, Il.

#### Additional Information

If you have any information about any of the crimes listed in these reports, please contact the Wheaton Police Department at 630-260-2161 or call DuPage Crimestoppers at (1-800-222-TIPS) or online at [www.dupagecrimestoppers.com](www.dupagecrimestoppers.com).

### Project Scope

Accumulate and analyze the crime reports posted from the [Wheaton Crime & Arrest Reports](https://www.wheaton.il.us/crimereports/).

#### Notes

In the middle of the 2016 reports, the PDF data format changes to separate more of the fields apart and additional fields added.

The `Crime Report 3-14-16 through 3-20-16.pdf`is the first report where the format changes.

2012 to mid 2016 format for each arrest looks like:
```
{
    "photo": "",
    "name": "",
    "charges": [],
    "date": "",
    "location": ""
}
```

Mid 2016 onwards we see some fields split and more added:
```
{
    "photo": "",
    "lastName": "",
    "firstName": "",
    "middleName": "",
    "age": "",
    "address": "",
    "city": "",
    "state": "",
    "zip": "",
    "charges": [],
    "arrestLocation": "",
    "arrestDateAndTime": "",
    "bond": "",
    "dischargeOrTransferDateAndTime": ""
}
```
