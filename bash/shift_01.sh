#!/bin/bash
echo "All Arguments Passed are follow: "
echo $*
echo "Shift By one Position:"
shift
echo "value of Positional Parameter $ 1 after shift:"
echo $1
echo "Shift by Two Positions:"
shift 2
echo "value of Positional Parameter $ 1 after two Shifts:"
echo $1
