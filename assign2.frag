//============================================================
// STUDENT NAME: Lai Zhin Hou Darryl
// MATRIC NO.  : A0122534R
// NUS EMAIL   : a0122534@u.nus.edu
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
// ============================================================
//
// FILE: assign2.frag


// The GL_EXT_gpu_shader4 extension extends GLSL 1.10 with 
// 32-bit integer (int) representation, integer bitwise operators, 
// and the modulus operator (%).

#extension GL_EXT_gpu_shader4 : require

#extension GL_ARB_texture_rectangle : require


uniform sampler2DRect InputTex;  // The input texture.

uniform int TexWidth;   // Always an even number.
uniform int TexHeight;

uniform int PassCount;  // For the very first pass, PassCount == 0.

int Size = TexWidth * TexHeight - 1;

vec2 sort(float first, float second) {
	return  (first <= second) ? vec2(first, second) : vec2(second, first);
}

vec2 getNextIndex(int row, int col) {
	int index1D = row * TexWidth + col;
	if (index1D==Size) { // Last of the lot
		return vec2(col, row); // Then just not do anythin
	} else if (col == TexWidth-1) { // if end of the row
		return vec2(0, row+1);//*
	} else if (col<0||col>TexWidth||row<0||row>TexHeight) {
		return vec2(col, row);//*/
	} else {
		return vec2(col+1, row);
	}
}

vec2 getPreviousIndex(int row, int col) { // row = y coord, col = x coord
	int index1D = row * TexWidth + col;
	if (index1D==0) { // First of the lot
		return vec2(col, row); // Then just not do anything
	} else if (col == 0) { // if end of the row
		return vec2(TexWidth-1, row-1);//*
	} else if (col<0||col>TexWidth||row<0||row>TexHeight) {
		return vec2(col, row);//*/
	} else {
		return vec2(col-1, row);
	}
}

vec2 getPair(int row, int col) {
	int index1D = row * TexWidth + col;
	if ((PassCount%2==0&&index1D%2==0)|| // if pass count is even, pairs are (0, 1)
		(PassCount%2!=0&&index1D%2!=0) // if pass count is odd, pairs are (1, 2)
		) { 
		return getNextIndex(row, col);
	} else {
		return getPreviousIndex(row, col);
	}
}

float getSortedItem(vec2 sorted, int row, int col) {
	int index1D = row * TexWidth + col;
	return ((PassCount%2==0&&index1D%2==0)||(PassCount%2!=0&&index1D%2!=0)) ? 
		sorted.x : sorted.y;
}

void main()
{
    float P1 = texture2DRect( InputTex, gl_FragCoord.xy ).a;
    float P2;
	
	int row = int( gl_FragCoord.y );
	int col = int( gl_FragCoord.x );

	vec2 pair = getPair(row, col) + vec2(0.5); // add 0.5 to pair;
	P2 = texture2DRect( InputTex, pair.xy ).a;
	gl_FragColor = vec4(getSortedItem(sort(P1, P2), row, col));
}
