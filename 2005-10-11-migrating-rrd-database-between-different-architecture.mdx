+++
title = "Migrating rrd database between different architecture"
slug = "2005-10-11-migrating-rrd-database-between-different-architecture"
published = 2005-10-11T20:18:00+05:30
author = "Santanu Misra"
tags = [ "Tech Notes",]
+++
This script you run on the source host from the same directory where all

those rrd files are there. I found this very helpful while migrating

between Linux and Solaris.  



  



    #/bin/csh



    set all_files=`echo *.rrd`

    echo $all_files

    foreach file ( $all_files )

    set base = `basename $file .rrd`

    /bin/rrdtool dump $file > /tmp/new1/$base.xml

    end



  



  

The do a \`tar\` with \`gzip\` as that will save lots of space and time

while transferring data between machines.  



  

And on the destination machine you uncompress and untar the file to an

empty directory.  



    #/bin/csh



    set all_files=`echo *.xml`

    echo $all_files

    foreach file ($all_files)

    set base = `basename $file .xml`

    /opt/local/bin/rrdtool restore $file /opt/local/htdocs/cacti/rra/$base.rrd

    end



  



  

  

Hope this helps.
