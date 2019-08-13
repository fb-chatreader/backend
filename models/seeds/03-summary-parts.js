exports.seed = function(knex, Promise) {
  // del entries
  return knex('summary_parts')
    .del()
    .then(function() {
      return knex('summary_parts').insert([
        {
          id: 1,
          book_id: 1,
          summary:
            "What's in it for me? Follow the quirky beginnings and meteoric rise of footwear empire. You certainly know the successful tagline of footwear giant Nike:Just Do It. It captures the daring spirit of Nike cofounder Phil Knight in the early years of his company. In these blinks, you'll discover how Knight fumbled his way to greatness, reaching out to business people across the world to make his way in the running shoe business with preparation whatsoever. You'll learn how he led a team of creative misfits, stood his ground in two major lawsuits and handled a truly infamous scandal - all the while building one of the more powerful brands the world has ever seen.\n\nIn these blinks, you'll also learn\n\nwhy the name \"Nike\" is perfect for running shoes;\nhow a new type of glue helps factory workers all over to avoid cancer; and why an Olympic coach experimented with fish-skin shoes.\n\n Nike's path to success started with a \"crazy idea\" and a trip around the world.\n\nIt was 1962 and Phil Knight was fresh out of business school. He was shy and a terrible salesperson.",
          created_at: new Date()
        },
        {
          id: 2,
          book_id: 1,
          summary:
            "But that didn't stop him from following a vision he had. Phil wanted to import Japanese running shoes to America and had his eye on the Tiger brand that was manufactured by the Japanese company Onitsuka.\n\nThe idea had first occurred to him while he was at Stanford Business School. At the time, neither his professors, classmates or even his father thought much of it.\n\nBut that didn't stop Phil, who traveled across the Pacific to sell his bold proposition to a room full of Japanese businessmen.\n\nHe didn't expect the pitch to be a success, but when the Onitsuka CEO told him that his timing was perfect and asked him the name of the company with which he would be working, Phil was stunned.\n\nCompletely unprepared, he blurted out the name, \"Blue Ribbon.\" Onitsuka then agreed to send him 300 pairs of Tiger shoes to start him off. Over the next several months, Phil would sell the Japanese shoes out of the trunk of his car!"
        },
        {
          id: 3,
          book_id: 1,
          summary:
            'After securing the deal with Onitsuka, Phil traveled the world. During his travels, he found a lot of inspiration through the things he saw and experienced.\n\nMuch of what he learned about the cultures he explored would influence him later in life. For instance, Phil was particularly inspired by the Greek Acropolis. He found himself standing in front of the Temple of Nike, the goddess of victory, for hours on end.\n\nYears later, Phil came across a play written by ancient Greek playwright Aristophanes called "The Knights." In it, a warrior gifts the king a new pair of shoes – in the Temple of Nike.\n\nPhil Knight\'s former running coach modified the early Tiger shoes they received and put Blue Ribbon in play.\n\nMany people have someone in their lives who inspires them, and whose respect they value. For Phil Knight, this person was his former running coach, Bill Bowerman.'
        },
        {
          id: 4,
          book_id: 1,
          summary:
            'Bill\'s approval gave Phil the confidence he needed to carry on with his dreams. Bill, in turn, was a genuine "shoe dog."\n\nA "shoe dog" is an industry term for someone who is shoe-obsessed. Such a person understands the shoe\'s role in allowing men and women to stride into the future with confidence.\n\nWhen Phil had run for Bill, he was his coach\'s unofficial shoe guinea pig. Bill was always experimenting to see how small changes in footwear would affect the performance of his athletes.\n\nTo do so, he would tear apart shoes and put them back together using whatever materials he thought would make the shoes an asset and not a mere necessity.\n\nHis primary goal was to make shoes as light as possible – a feature which would later become a trademark of the Nike brand. Bill was so obsessed with this goal that he once used cod fish skin instead of leather to make a lighter pair of shoes'
        },
        {
          id: 5,
          book_id: 1,
          summary:
            "When Phil returned from Japan, he went to see Bill, asking him to partner with him at Blue Ribbon. Bill agreed, and Phil got a big confidence boost. He began to believe that his \"crazy idea\" might amount to something. Indeed, the cooperation was successful.\n\nTiming again was key. When Blue Ribbon was in its infancy, Bill's coaching career was picking up steam. He was even training future Olympians. As he altered the imported Tiger shoes for his star runners, Bill helped to give the brand more exposure, helping Phil sell more pairs.\n\nPhil also sent Bill's first modified shoe prototype, the Cortez, to Onitsuka, suggesting that the company manufacture these new, performance-tested shoes.\n\nOnitsuka agreed, and Cortez was Blue Ribbon's first sales success."
        },
        {
          id: 6,
          book_id: 1,
          summary:
            "In this fashion, Bill helped the young company get off the ground. The continued success of Blue Ribbon, however, was in large part because of Phil's unconventional, yet brilliant, employees.\n\nTalented eccentrics made up the early Blue Ribbon team, and they all helped make key decisions.\n\nAs Blue Ribbon grew, Phil put together a team of trustworthy people who in turn trusted him.\n\nBut Blue Ribbon workers weren't your run-of-the-mill corporate types. They were instead a bunch of brilliant misfits who formed a great team."
        },
        {
          id: 7,
          book_id: 1,
          summary:
            "They may have worked so well together precisely because they ere misfits. This fact allowed each team member to see past a coworker's quirks to the genius within. No one felt he had to hold back.\n\nFrom the get go, Blue Ribbon employees all believed in Phil and his vision. The company's first full-time employee, Jeff Johnson, worked tirelessly, designing innovative shoes alongside Bill Bowerman.\n\nTo keep the Blue Ribbon team strong, a few times each year Phil would hold his version of a team-building weekend that he called \"Buttfaces.\"\n\nAt this event, everyone could yell at each other before getting drunk. It was a reminder that no one was too important to be mocked. Yet drunken shouting matches weren't the only way Phil maintained morale. He also involved his team in many company decisions."
        },
        {
          id: 8,
          book_id: 1,
          summary:
            "When it came to everyday work, Phil followed General Patton's words of wisdom: \"Don't tell people how to do things. Tell them what to do and let them surprise you with their results.\"\n\nPhil, for example, never once told Jeff Johnson how to do his job. He never even gave Jeff a hard time for sending him countless letters, with subjects ranging from advertising questions to poems and even jokes.\n\nPhil included his team when bigger decisions needed to be made, too. In 1971, it was decided that the company would stop selling Onitsuka shoes and begin making its own. However, the Blue Ribbon brand wasn't suitable for this move, and so a successor company needed to be developed. Rather than branding this new business himself, Phil asked his employees to suggest names for it."
        },
        {
          id: 9,
          book_id: 1,
          summary:
            'Surprisingly, the name Nike came to Jeff Johnson in a dream. Phil went with it, remembering the impression the Temple of Nike had made on him so many years ago in Athens.\n\n\nLawsuits brought by Onitsuka and the government threatened Nike, but the company persevered.\n\nMany successful entrepreneurs know that fame and fortune are always dogged by obstacles and pitfalls.\n\nSpecifically, for Phil Knight, two significant lawsuits threatened to stop his career dead in its tracks.\n\nThe first arrived in 1973 when Onitsuka attempted to sue Blue Ribbon in Japan for costs that had been incurred through a breach of contract – a breach that occurred when Blue Ribbon started producing and distributing Nike shoes.'
        },
        {
          id: 10,
          book_id: 1,
          summary:
            "To defend itself, Blue Ribbon sued Onitsuka in the United States for breach of contract as well as trademark infringement. Blue Ribbon had an exclusive contract to distribute Tiger's track-and-field line in America. Yet Phil had an informant at Onitsuka, who tipped him off that an Onitsuka executive was planning a trip to America in search of a replacement distributor.\n\nArmed with this information, Phil shifted his focus to building his new company, Nike.\n\nEventually, the lawsuit resulted in a favorable judgment for Blue Ribbon. The judge said his decision was based on which of the two companies was more honest – and that in this particular case, Blue Ribbon was the most honest partner. Onitsuka was ordered to pay damages.\n\nThis was just the first major threat to Phil and his work. The second came in 1977, when Nike was told that it owed the government $25 million."
        },
        {
          id: 11,
          book_id: 1,
          summary:
            "The trouble started when Nike's competitors in America, Keds and Converse, worked together to uncover an obscure customs law called the American Selling Price law, whereby certain types of shoes would incur significantly higher customs duties. They accused Nike of violating it.\n\nBut Phil wasn't going to give up without a fight. His belief that Nike was innocent helped Phil through the stressful situation.\n\nSo while Phil wanted the government to drop its claim altogether, he eventually took the recommendation of a trusted advisor and as a diplomatic gesture settled the claim for $9 million.\n\nPhil felt that if he fought the government's claim tooth and nail, he'd never regain its goodwill, something his company might need at a later date."
        },
        {
          id: 12,
          book_id: 1,
          summary:
            'Phil Knight feared an IPO would taint the unique culture at Nike, yet its spirit stayed strong.\n\nClearly, Phil faced some obstacles on his rise to the top. It took a lot of hard work to keep going.\n\nSo how did Nike grow to become the company it is today?\n\nAlthough he wasn\'t always sure what winning meant to him, Phil knew that he didn\'t want to lose.\n\nThis was partly due to a fear of disappointing his father and partly because he thought work should be both playful and meaningful. The combination convinced him that he had to avoid a passive life that just seemed to "slip" by.\n\nSo while Phil knew that taking Nike public could solve some financial problems, his desire to keep his business playful and fun made him hesitant to do so.'
        },
        {
          id: 13,
          book_id: 1,
          summary:
            "In short, Phil ran his business according to the motto, \"grow or die.\" This meant that aside from the money he used to pay the modest salaries he and his employees received, all profits were invested in the business, helping it to grow.\n\nThis financing strategy meant that Phil was reliant on banks, which often refused him the large loans he requested. In the banks' stead, Japanese trading company Nissho helped Nike with financing.\n\nBut eventually, the $25 million lawsuit brought by the government pushed Phil into taking Nike public with an initial public offering. Yet he still worried that an IPO would cost him control of the company and its unique code of ethics, transforming Nike into yet another corporate machine.\n\nThankfully, one of Phil's associates had an innovative idea of how to design the company's share structure to prevent this, ensuring Nike remained in charge. To this day, the company prides itself on its integrity, to which it also attributes much of its worldwide success."
        },
        {
          id: 14,
          book_id: 1,
          summary:
            "Through improving factory working conditions and treating sponsored athletes well, Nike strives to stay true to its values.\n\nSince its origins, Nike as a company has approached setbacks with the same integrity and energy that Phil always demanded of each and every employee. It's this attitude that has kept customers loyal through thick and thin.\n\nNike is now working hard to set better labor standards for its factory workers. In the nineties, the company found itself at the center of a damaging report on the abysmal working conditions of Asian sweatshops.\n\nNike rented workspace in these factories just like many other corporations did. Yet the report's author knew that Nike's name recognition would draw media attention, and thus the footwear company became the center of the story.\n\nNike had worked hard to increase the wages of its factory workers, but was stopped in one country by a top government official who said that factory workers who earned more than doctors would be bad for the economy."
        },
        {
          id: 15,
          book_id: 1,
          summary:
            "But after the shameful exposure, Phil and his team knew they had to try harder.\n\nOne of the primary means by which the company improved factory conditions was the invention of a water-based bonding agent to attach shoe uppers to the soles of a shoe.\n\nThis was a huge development. The so-called rubber room was previously the most carcinogenic area in a shoe factory. Nike's new bonding agent cut out 97 percent of the toxins found in the previous one.\n\nIn fact, Nike even shared the new glue with its competitors, and they began using it in their factories.\n\nAnd Nike's commitment to integrity doesn't stop at the factory door. Phil treats all Nike's sponsored athletes as real people and not just vehicles for selling products. Because of this respect, many Nike-sponsored athletes have become Phil's personal friends."
        },
        {
          id: 16,
          book_id: 1,
          summary:
            "When Phil's son died in a scuba diving accident, for example, every single Nike athlete wrote or called to offer condolences. In the years that followed, one athlete in particular became good friends with Phil: Tiger Woods.\n\nIn conclusion, few global companies have as much heart as Nike.\n\nFinal summary\n\nThe key message in this book:\n\nThe story of shoe giant Nike is one of humble beginnings and \"crazy\" ideas. The company's rise to world fame goes to show that if you believe in your ideas, think outside the box and stay true to your values, there's no limit to what you can accomplish.\n\nActionable advice:"
        },
        {
          id: 17,
          book_id: 1,
          summary:
            "Surround yourself with believers.\n\nStarting a successful business requires surrounding yourself with people who believe in you and your idea – people who aren't in it just for the money. Employees with real passion will be the most involved team members you can find, and they'll stick with you when the going gets tough.\n\nGot feedback?\n\nWe'd sure love to hear what you think about our content! Just drop an email to remember@blinkist.com with the title of this book as the subject line and share your thoughts!"
        },
        {
          id: 18,
          book_id: 1,
          summary:
            'Suggested further reading: Losing My Virginity by Richard Branson\n\nLosing My Virginity is the internationally best-selling autobiography of self-made businessman Richard Branson. He details his lucrative adventures, beginning with dropping out of school, founding a record label and crossing the Atlantic ocean on a speedboat. In essence, the book is about how cleverness, determination and an adventurous mindset played a role in the making of one of the richest men on earth.'
        },
        {
          id: 19,
          book_id: 1,
          summary:
            "What's in it for me? Follow the quirky beginnings and meteoric rise of a footwear empire.\n\nYou certainly know the successful tagline of footwear giant Nike: Just Do It.\n\nIt captures the daring spirit of Nike cofounder Phil Knight in the early years of his company.\n\nIn these blinks, you'll discover how Knight fumbled his way to greatness, reaching out to businesspeople across the world to make his way in the running shoe business with no preparation whatsoever."
        },
        {
          id: 20,
          book_id: 1,
          summary:
            'You\'ll learn how he led a team of creative misfits, stood his ground in two major lawsuits and handled a truly infamous scandal – all the while building one of the more powerful brands the world has ever seen. In these blinks, you\'ll also learn why the name "Nike" is perfect for running shoes; how a new type of glue helps factory workers all over to avoid cancer; and why an Olympic coach experimented with fish-skin shoes.'
        }
      ]);
    });
};
