base32 LGT Javascript Encoder/Decoder
==============

**Encodes** Lowercase general text (without numerals, with common punctuations) to 5 bit base32 LGT binary data, which is representated in hexadecimal notation.

**Decodes** base32 LGT binary data (hexadecimal notation) to lowercase general text (without numerals, with common punctuations).

This projected is licensed under the terms of the MIT license, and is developed by [Vihar Innovations LLP](https://viharinnovations.com/).

[Live Demo Page](https://viharinnovations.com/base32LGT/)

[base32 LGT - Lowercase General Text](https://viharinnovations.com/base32LGT/base32LGT.pdf)

Alphabets
--------------
```javascript

							base32 LG-TEXT
					    
   00000   space    01000   h       10000   p       11000   x
   00001   a        01001   i       10001   q       11001   y
   00010   b        01010   j       10010   r       11010   z
   00011   c        01011   k       10011   s       11011   .
   00100   d        01100   l       10100   t       11100   ,
   00101   e        01101   m       10101   u       11101   -
   00110   f        01110   n       10110   v       11110   ?
   00111   g        01111   o       10111   w       11111   '
   
```

base32_lg_text.js
--------------


* Has a base32 char-set in array base32[]


* **encode(text, base32)** 

  *returns* encoded base32 in hexadecimal.
  
  Here text has only the symbols defined in
  
  base32 array
  
  
* **decode(hex, base32)**

	*returns* decoded text defined in base32 array

	Here **hex code** must have even number
  	of nibbles

