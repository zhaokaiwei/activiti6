import java.util.ArrayList;
import java.util.List;

/**
 * @author zkw
 * @date 2019/10/21 15:43
 */
public class Objective3 {

    private static List<int[]> list = new ArrayList<>();

    public static void main(String[] args) {
        int x = 5,y = 5;        // 1所在的位置坐标
        int[][] visit = new int[6][6];
        input(x,y,visit);
    }

    public static void input(int x ,int y ,int[][] visit){
        if (x < 1 || x > 5 || y < 1 || y > 5 || visit[x][y] == 1){
            return ;
        }

        visit[x][y] = 1;
        list.add(new int[]{x,y});

        if (list.size() == 25){
            for (int i=1;i<=25;++i){
                int[] xyz = list.get(i-1);
                System.out.println(i+"：（"+xyz[0]+"，"+xyz[1]+"）");
            }
            System.out.println();
            visit[x][y] = 0;
            list.remove(list.size()-1);
            return ;
        }

        int next_x = x + 3;
        int next_y = y;
        input(next_x,next_y,visit);

        next_x = x - 3;
        next_y = y;
        input(next_x,next_y,visit);

        next_x = x;
        next_y = y + 3;
        input(next_x,next_y,visit);

        next_x = x;
        next_y = y - 3;
        input(next_x,next_y,visit);

        next_x = x + 2;
        next_y = y + 2;
        input(next_x,next_y,visit);

        next_x = x + 2;
        next_y = y - 2;
        input(next_x,next_y,visit);

        next_x = x - 2;
        next_y = y + 2;
        input(next_x,next_y,visit);

        next_x = x -2;
        next_y = y - 2;
        input(next_x,next_y,visit);

        visit[x][y] = 0;
        list.remove(list.size()-1);
    }
}
