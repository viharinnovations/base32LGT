/*
The MIT License (MIT)

Copyright (c) 2015 Vihar Innovations LLP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//BASE32-LG-TEXT character set
var base32 = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", ",", "-", "?", "'"];

//String Buffer ADT
function StringBuffer() {
    this.__strings__ = new Array;
}

StringBuffer.prototype.append = function(str) {
    this.__strings__.push(str);
};

StringBuffer.prototype.toString = function() {
    return this.__strings__.join("");
};

StringBuffer.prototype.unshift = function(str) {
    this.__strings__.unshift(str);
};

StringBuffer.prototype.clear = function() {
    this.__strings__ = [];
};


//---------------------internal functions ----------------------------------------------//

//recieves carry and the current 5 bit data
//returns 4 bit hex and carry for next iteration
function slice_hex(x, carry) {

    //temp storage of o/p hex
    var hex_tmp = new StringBuffer();

    //carry stack
    var carry_tmp = new StringBuffer();

    //main stack for operation
    var hex = new StringBuffer();

    //store single hex char
    var hexval;

    //add carry from parameter
    hex.append(carry);

    //append current hex
    hex.append(x);

    //slice 1st 4 bits from left
    hex_tmp.append(hex.toString().slice(0, 4));

    //slice remaining bit for carry output
    carry_tmp.append(hex.toString().slice(4, carry.length + 5));



    //convert binary to hex char for o/p
    hex_val = parseInt(hex_tmp.toString(), 2).toString(16);

    //return object
    return {
        hex: hex_val,
        carry: carry_tmp.toString()
    };
}

//recieves carry and the current nibble
//returns 5 bit base32 and carry for next iteration
function slice_bin(x, carry, prev_len) {

    //holding 5 bit binary result derived from x
    var bin_tmp = new StringBuffer();

    //o/p any carry for the next nibble
    var carry_tmp = new StringBuffer();

    //for carry from prev nibble (via para)
    var carry_x = new StringBuffer();

    //add carry from parameter
    bin_tmp.append(carry);


    //if no prev carry
    if (prev_len == 0 || prev_len == 5) {

        //if carry has only 0 or 1 bit(s), then
        //current hex bits can be added
        if (bin_tmp.toString().length < 2) {

            bin_tmp.append(x);

        } else {
            bin_tmp.append(x);

            //slice extra bits for carry the next iteration
            carry_tmp.append(bin_tmp.toString().slice(5, prev_len + bin_tmp.toString().length));

            //take the full current 4 bit nibble x
            carry_x.append(bin_tmp.toString().slice(0, 5));
            bin_tmp.clear();
            bin_tmp.append(carry_x.toString());

        }
    } else {
        bin_tmp.append(x);
        carry_tmp.append(bin_tmp.toString().slice(5 - prev_len, prev_len + bin_tmp.toString().length));

        //take the full current 4 bit nibble x
        carry_x.append(bin_tmp.toString().slice(0, 5 - prev_len));
        bin_tmp.clear();
        bin_tmp.append(carry_x.toString());

    }


    //return object
    return {
        bin: bin_tmp.toString(),
        carry: carry_tmp.toString()
    };
}

//finds and returns index of i/p char
//in base32 char set
function find(x, base32) {

    //x is any base32 character
    var ret = -1;
    for (i = 0; i < base32.length; i++) {
        if (base32[i] === x) {
            ret = i;
            break;
        }
    }
    return ret;
}


//zero padding to 4 bit - infront --decode
function p_front_d(x) {
    var tmp = new StringBuffer();
    for (i = 0; i < 4 - x.length; i++)
        tmp.append("0");
    tmp.append(x);
    return tmp.toString();
}


//zero padding to 5 bit - infront --encode
function p_front(x) {
    var tmp = new StringBuffer();
    for (i = 0; i < 5 - x.length; i++)
        tmp.append("0");
    tmp.append(x);
    return tmp.toString();
}



//zero padding to complete 
//the last hex nibble
function p_last(x) {
    var tmp = new StringBuffer();
    for (i = 0; i < 4 - x.length; i++)
        tmp.append("0");
    tmp.unshift(x);
    return tmp.toString();
}

//zero padding to complete 
//the last 5 bit base32
function p_last_d(x) {
    var tmp = new StringBuffer();
    for (i = 0; i < 5 - x.length; i++)
        tmp.append("0");
    tmp.unshift(x);
    return tmp.toString();
}




//---------------------internal functions ----------------------------------------------//



//encode ------------------------------------------------------------------------------------>
function encode(chars, base32) {

    //return var
    var ret = 1;

    //Lowercase General text - Input
    var chars = chars.split('');

    //Input Length
    len = chars.length;

    //index for input char loop
    //processing
    var iun = 0;

    //hex output stack
    var hex = new StringBuffer();

    //carry stack for extra bits
    var carry = new StringBuffer();

    //processing loop
    while (iun < len) {

        if (find(chars[iun], base32) == -1) {

            //throw exception and break
            var ret = -1;
            break;
        }

        //char index is found in base32 char-set
        //converted to binary (index=2), padded
        //with zeros in front for 5 bit conformity	
        x = p_front(find(chars[iun], base32).toString(2));


        //add prev. carry to current 5 bit, return first
        //4 bits from left as hex nibble, and remaining bits
        //as carry
        var result = new slice_hex(x, carry.toString());

        //push returned hex nibble to global stack
        hex.append(result.hex);


        //flush carry stack before storing new carry value
        carry.clear();

        //check is carry has become 4 bits
        if (result.carry.length >= 4 && iun != len - 1 && parseInt(result.carry, 2).toString(16) != 0) {

            //convert 4 carry bits to hex nibble
            hex_val = parseInt(result.carry, 2).toString(16);

            //push returned hex nibble to global stack
            hex.append(hex_val);

            //empty carry string
            result.carry = "";
        } else {
            if (result.carry.length >= 4 && iun < len - 1) {
                //convert 4 carry bits to hex nibble
                hex_val = parseInt(result.carry, 2).toString(16);

                //push returned hex nibble to global stack
                hex.append(hex_val);

                //empty carry string
                result.carry = "";
            }

        }

        //store the carry, returned in current
        //iteration to carry stack	
        carry.append(result.carry);




        iun++;

        //if carry remains after last iteration,
        //zero pad for 4 bit hex nibble  conformity
        if (iun == len && result.carry.length != 0) {

            //dont zero padd if last 		
            if (parseInt(p_last(result.carry), 2).toString(16) != 0)
                hex.append(parseInt(p_last(result.carry), 2).toString(16));
            else
            //only single zero carried
            if (result.carry == '0')
                hex.append(parseInt(p_last(result.carry), 2).toString(16));

            //if no. of hex nibbles in o/p is odd

            if (hex.toString().length % 2 == 1)

            //add a zero nibble infront 
            //of the global hex stack
                hex.unshift(parseInt("0000", 2).toString(16));

        }
        if (iun == len && hex.toString().length % 2 == 1)
        //add a zero nibble infront 
        //of the global hex stack
            hex.unshift(parseInt("0000", 2).toString(16));




    }

    var hex_out = hex.toString();

    if (ret == -1)
        hex_out = ret;

    //return object
    return {
        hex: hex_out,
        hex_length: hex.toString().length / 2
    };


}
//encode ------------------------------------------------------------------------------------>	

//decode ------------------------------------------------------------------------------------>
function decode(chars, base32) {

    //return var
    var ret = 1;

    //Hex - Input
    var chars = chars.split('');

    //Input Hex Length
    len = chars.length;

    //hex nibbles cannot be odd length	
    if (len % 2 == 1)
        ret = -2;


    //index for input char loop
    //processing
    var iun = 0;


    //carry stack for extra bits
    var carry = new StringBuffer();

    //5 bit temp base32 char
    var bin = new StringBuffer();

    //text o/p stack
    var text = new StringBuffer();

    //prev len of return bin data
    var prev_len = 0;

    //one time exe flag
    var otflag = 0;

    //processing loop
    while (iun < len && ret == 1) {

        //check for front zero padding nibble	
        if (chars[iun] === '0' && iun == 0 && chars[iun + 1] != 'a') {
            //ignore it, move to next hex nibble
            iun++;
        }

        //check for hex input char exception
        if (isNaN(parseInt(chars[iun], 16).toString(2))) {

            //throw execption and break
            ret = -1;
            break;
        }

        //get current nibble,zero pad if required
        x = p_front_d(parseInt(chars[iun], 16).toString(2));



        //add prev. carry to current nibble, return first
        //5 bits from left as base32 char, and remaining bits
        //as carry
        var result = new slice_bin(x, carry.toString(), prev_len);

        //store returned 5 bit data-length
        prev_len = result.bin.length;

        //flush carry stack before storing new carry value
        carry.clear();

        //store the carry, returned in current
        //iteration to carry stack	
        carry.append(result.carry);

        //if return data-length is less than 5 bit
        if (prev_len < 5) {

            //append to 5 bit bin stack
            bin.append(result.bin);

            //if return data-length is  5 bit base32 char
            if (bin.toString().length == 5) {


                //convert data to decimal, find corresponding
                //char in base32 char set, append to global text stack
                text.append(base32[parseInt(bin.toString(), 2).toString(10)]);

                //modify prev len
                prev_len = 5;

                //clear 5 bit bin stack
                bin.clear();

            }

        } else {

            //get base32 char from the resp. decimal index
            //append to global text stack
            text.append(base32[parseInt(result.bin, 2).toString(10)]);
            prev_len = 5;
            bin.clear();

        }

        //set the flag as one time 
        //execution done	
        if (otflag == 0)
            otflag = 1;
        else
            otflag = 2;

        //process 2nd hex nibble only once
        if (otflag == 1) {






            iun++;
            //check for hex input char exception
            if (isNaN(parseInt(chars[iun], 16).toString(2))) {

                //throw execption and break
                ret = -1;
                break;
            }

            //get 2nd nibble
            x = p_front_d(parseInt(chars[iun], 16).toString(2));

            result = new slice_bin(x, carry.toString(), prev_len);
            prev_len = result.bin.length;

            carry.clear();
            carry.append(result.carry);

            if (prev_len < 5) {

                bin.append(result.bin);

                text.append(base32[parseInt(bin.toString(), 2).toString(10)]);
                prev_len = 5;
                bin.clear();


            } else {
                text.append(base32[parseInt(result.bin, 2).toString(10)]);
                prev_len = 5;
                bin.clear();
            }


        }


        iun++;

        if (iun == len && carry.toString().length != 0) {

            ////dont zero padd/space if last 		
            if (parseInt(p_last(carry.toString()), 2).toString(10) != 0)
                text.append(base32[parseInt(p_last_d(carry.toString()), 2).toString(10)]);

        }

    }

    var text_out = text.toString();

    if (ret == -1 || ret == -2)
        text_out = ret;

    //return object
    return {
        text: text_out,
        text_length: text.toString().length
    };



}
//decode ------------------------------------------------------------------------------------>