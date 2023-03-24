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
        {
          type: GameTaskType.Action,
          text: 'Стань навкарачки й гавкай на всіх учасників',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чого ти не зробиш ніколи в житті за будь-які гроші?',
        },
        {
          type: GameTaskType.Action,
          text: 'Постав перед собою будь-який предмет і, звертаючись до нього "колега", проведи з ним 3-хвилинну дискусію на серйозну тему',
        },
        {
          type: GameTaskType.Truth,
          text: 'Тобі дали $1млн, який можна витратити тільки на розваги, як би ти їх витратив(-ла)?',
        },
        {
          type: GameTaskType.Action,
          text: 'Вимови не затинаючись, будь-яку скоромовку',
        },
        {
          type: GameTaskType.Truth,
          text: 'Розкажи про найбільш нерозважливий вчинок у твоєму житті.',
        },
        {
          type: GameTaskType.Action,
          text: 'Зімітуй гравця, що сидить ліворуч, повністю копіюючи його міміку, голос і манеру поводження',
        },
        {
          type: GameTaskType.Truth,
          text: 'Ти можеш виправити одну свою помилку, що це буде?',
        },
        {
          type: GameTaskType.Action,
          text: 'Ти брокер. Переконай когось із гравців купити квартиру поряд з цвинтарем.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Заради якої музичної групи або артиста, щоб почути їх наживо, ти готовий(-а) поїхати до будь-якого куточка світу?',
        },
        {
          type: GameTaskType.Action,
          text: 'Виконай танець робота.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Якої ти думкаи про гравця, що сидить ліворуч?',
        },
        {
          type: GameTaskType.Action,
          text: 'Покажи сцену "В`язень в одиночній камері водить хоровод"',
        },
        {
          type: GameTaskType.Truth,
          text: 'У тебе в школі був(-ла) пикладач(-ка), з яким(-ою) тобі хотілось переспати?',
        },
        {
          type: GameTaskType.Action,
          text: 'Уяви на 5 хвилин, що в тебе на плечі сидить папуга. Говори з ним і періодично годуй його.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Ти робив(-ла) щось таке, за що тобі дотепер соромно?',
        },
        {
          type: GameTaskType.Action,
          text: 'Розрекламуй гравця, що сидить праворуч, як цінний товар.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Актор або актриса, з яким ти б, не замислюючись, переспав(-ла)?',
        },
        {
          type: GameTaskType.Action,
          text: 'Зроби дурнувати фотку з будь-яким гравцем і постав на аватарку в будь-якій соцмережі.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чи робив(-ла) ти щось заборонене? Якщо так, що саме?',
        },
        {
          type: GameTaskType.Action,
          text: 'Якщо в компанії є дівчина, вона повинна зробити тобі яскравий макіяж.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Яка риса твого характеру найгірша?',
        },
        {
          type: GameTaskType.Action,
          text: 'Покажи п`яного зомбі, який намагаєтся зайнятись сексом з іншими гравцями.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Розкажи історію, коли ти був(-ла) за крок до смерті.',
        },
        {
          type: GameTaskType.Action,
          text: 'До кінця гри, коли хтось сідає, ти повинен(-на) зображати "пук", показуючи мімікою, що погано тхне.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чим ти мріяв(-ла) займатися, але поки не було такої можливості?',
        },
        {
          type: GameTaskType.Action,
          text: 'Вийди на балкон/вулицю та гукни: " Па-ли-ти! Я хочу па-ли-ти!',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чи погодишся відмовитись від свого нинішнього життя, близьких і другів за $1 млн?',
        },
        {
          type: GameTaskType.Action,
          text: 'Зроби фото в еротичній позі й виклади в свій Інстаграм / Фейсбук із хештегом #правдачидія.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Ти йшов(-ла) з кав`ярні, не сплативши рахунок?',
        },
        {
          type: GameTaskType.Action,
          text: 'Установи статус "Життя - біль" у будь-якій із соцмереж',
        },
        {
          type: GameTaskType.Truth,
          text: 'Чого в житті ти боїшся найбільше?',
        },
        {
          type: GameTaskType.Action,
          text: 'Намалюй собі моноброви за допомогою підручних засобів.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Якби ти потрапив(-ла) на безлюдний острів, кого з гравців ти б хотів(-ла) бачити поруч?',
        },
        {
          type: GameTaskType.Action,
          text: 'Намалюй собі вуса й цапову борідку. Ходи так до кінця гри.',
        },
        {
          type: GameTaskType.Truth,
          text: 'За що, на твою думку, друзі люблять і цінують тебе?',
        },
        {
          type: GameTaskType.Action,
          text: 'Гравці праворуч і ліворуч від тебе зіграють партію в хрестики-нулики на твоєму животі.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Маєш можливість повернутись в минуле. В який рік ти б повернувся(-лась) і чому?',
        },
        {
          type: GameTaskType.Action,
          text: 'Гортай свою телефонну книгу, поки учасники не скажуть слово "стоп". Першому контакту за абектою відправ повідомлення з текстом: "Вітаю, ну як?"',
        },
        {
          type: GameTaskType.Truth,
          text: 'Можеш набути корисну навичку. Яку саме обереш?',
        },
        {
          type: GameTaskType.Action,
          text: 'У тебе синдром Туретта. До кінця гри кожні 30 секунд ти повинен робити різкий мимовільний рух і водночас вигукувати брутальне лайливе слово.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Що ти подумав(-ла) про гравця, що сидить праворуч, коли вперше його (її) побачив(-ла)?',
        },
        {
          type: GameTaskType.Action,
          text: 'Уяви, що ти дельфін. Переконай у цьому оточуючих.',
        },
        {
          type: GameTaskType.Truth,
          text: 'Розкажи про своє перше кохання.',
        },
      ]);
    await queryRunner.query(...query.getQueryAndParameters());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.createQueryBuilder().delete().from(GameTaskEntity).execute();
  }
}
