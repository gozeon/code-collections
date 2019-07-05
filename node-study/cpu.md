# nodejs 问题

遇到cpu计算的时候，或者非常耗时的任务，nodejs会线程阻塞的，虽然基于事件I/O，但事件队列里还是顺序执行的，如果前一个任务非常耗时，下一个则不会返回，所以nodejs可能仅仅适合业务或者说web层面，如果做一些运维方面或者计算任务时候，nodejs就力不从心了

# 解决

可以用 child_process (fork), cluster, worker等方法。 