import { MigrationInterface, QueryRunner } from 'typeorm';
import { GameTaskEntity, GameTaskType } from '../entities/game-task.entity';

export class gameTaskData1679409750030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(GameTaskEntity)
      .values([
        {
          type: GameTaskType.Action,
          text: 'Посади гравця, що сидить ліворуч, до себе на коліна, нехай він просидить так увесь наступний раунд',
        },
        {
          type: GameTaskType.Truth,
          text: 'Яку частину тіла ти миєш у душі першою',
        },
        {
          type: GameTaskType.Action,
          text: 'Виконай будь-яке бажання гравця, що сидить ліворуч',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чи було в тебе нерозділене кохання? Розкажи про нього.',
        },
        {
          type: GameTaskType.Action,
          text: 'Візьми дві трубочки (або скурти в трубочки серветки), встав у ніс і зобрази моржа',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чи крав(-ла) ти щось в магазині? Що це було?',
        },
        {
          type: GameTaskType.Action,
          text: 'Вибери двох гравців. Постав з ними акробатичний етюд.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Якщо водночас тонула людина, яку ти любиш і людина, яка любить тебе, кого б ти врятував(-ла)?',
        },
        {
          type: GameTaskType.Action,
          text: 'Знайди гравця з найприємнішим ароматом волосся',
        },
        {
          type: GameTaskType.Truth,
          text: 'Тобі запропонували вічну молодість і купу грошей за умови, що в тебе ніколи не буде інтиму, погодишся?',
        },
        {
          type: GameTaskType.Action,
          text: 'Постав собі на дзвінок диктофонний запис, зроблений іншими гравцями.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чи брав(-ла) ти гроші в борг, а потім не повертав(-ла)?',
        },
        {
          type: GameTaskType.Action,
          text: '5 хвилин розмовляй голосом маленької дитини.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Любиш спати голяка чи в одязі?',
        },
        {
          type: GameTaskType.Action,
          text: 'Зателефонуй другу/подрузі й скажи що ти п`яний(-а), їдеш до нього/неї та кинь слухавку',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чи має для тебе значення думка оточуючих?',
        },
        {
          type: GameTaskType.Action,
          text: 'Зателефонуй за якимось з оголошень і запроси на побачення людину, яка тобі відповіла',
        },
        {
          type: GameTaskType.Truth,
          text: 'Ти залишаєш чайові?',
        },
        {
          type: GameTaskType.Action,
          text: 'Першого гравця, що сидить ліворуч, поцілуй, другого обійми, третьому потисни руку',
        },
        {
          type: GameTaskType.Truth,
          text: 'Кого із всесвітньовідомих людей ти б узяв(-ла) собі за раба?',
        },
        {
          type: GameTaskType.Action,
          text: 'Говори про себе в третій особі протягом 5 хвилин',
        },
        {
          type: GameTaskType.Truth,
          text: 'Розкажи найсмішніший анекдот',
        },
        {
          type: GameTaskType.Action,
          text: 'Зроби для кожного гравця медаль з підручних засобів із написом "Най.."(придумай сам)',
        },
        {
          type: GameTaskType.Truth,
          text: 'Ти читав(-ла) чужі листи або повідомлення',
        },
        {
          type: GameTaskType.Action,
          text: 'Зайди на будь-який жіночий форум і створи там тему: "Всі баби дурепи, ви повну хрінь тут обговорюєте"',
        },
        {
          type: GameTaskType.Truth,
          text: 'Можеш змінити якусь особисту якісь. Чого ти хочеш позбутися насамперед?',
        },
        {
          type: GameTaskType.Action,
          text: 'Дай чесну відповідь на будь-яке запитання одного з гравців.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Який твій найромантичніший вчинок?',
        },
        {
          type: GameTaskType.Action,
          text: 'Покажи першопрохідника на місяці який зустрів там бомжа.',
        },
        {
          type: GameTaskType.Truth,
          text: 'У тебе є можливість помінятися з кимось місцем, хто це буде?',
        },
        {
          type: GameTaskType.Action,
          text: 'Скажи гравцю навпроти все, що ти про нього думаєш',
        },
        {
          type: GameTaskType.Truth,
          text: 'Яку країну тобі хочется відвідати найбільше?',
        },
        {
          type: GameTaskType.Action,
          text: 'Втримуй олівець на носі не менше 30 секунд',
        },
        {
          type: GameTaskType.Truth,
          text: 'Яку найнепристойнішу пропозицю ти отримував(-ла)?',
        },
      ]);
    await queryRunner.query(...query.getQueryAndParameters());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.createQueryBuilder().delete().from(GameTaskEntity).execute();
  }
}
