
data =
{
  firstName: "jakub",
  lastName: "Švehla",
  email: "svehl.jakub@gmail.com",
  birthDate: "2017-11-11",
  superPowers: [
    {
      label: "plav",
      value: "plav"
    },
    {
      label: "let",
      value: "let"
    },
  ]
}


'{"firstName":"jakub","lastName":"Švehla","email":"svehl.jakub@gmail.com","birthDate":"2017-11-11"'
select * from astronauts.add_astronaut(
  '{"firstName":"jakub","lastName":"Švehla","email":"svehl.jakub@gmail.com","birthDate":"2017-07-29"}',
  '[{"label":"pl"},{"label":"plavánííí"}]'
);




-- Function: astronauts.add_astronaut(json, json)

-- DROP FUNCTION astronauts.add_astronaut(json, json);


CREATE OR REPLACE FUNCTION astronauts.add_astronaut(
    astronaut json,
    superpowers json)
  RETURNS void AS
$$
DECLARE
    userId int;
    item json;
    superPowerId int;
    possibleId int;
BEGIN
  -- SELECT id INTO possibleId FROM tests.rules WHERE rules.rule = ruleParam;

  WITH upd AS (
    INSERT INTO astronauts.astronauts(
              first_name, last_name, birth_date, email, color)
      VALUES (
        astronaut ->> 'firstName',
        astronaut ->> 'lastName',
        to_date(astronaut ->> 'birthDate', 'YYYY-MM-DD'),
        astronaut ->> 'email',
        astronaut ->> 'color'
      ) RETURNING id
  ) SELECT id INTO userId from upd;

  FOR item IN SELECT * FROM json_array_elements(superPowers)
  LOOP
    SELECT id INTO superPowerId FROM astronauts.super_powers
       WHERE super_powers.name = item ->> 'label';

    IF superPowerId IS NULL then
      WITH upd AS (
        INSERT INTO astronauts.super_powers(name) VALUES ( item ->> 'label' ) RETURNING id
      ) select id INTO superPowerId from upd;
      raise notice 'NULKY: %', superPowerId;
    ELSE
      raise notice 'už je tato superschopnost registrovaná: %', superPowerId;
    END IF;

    INSERT INTO astronauts.astronauts_super_powers_map(
      id_astronaut, id_super_power)
      VALUES (userId, superPowerId);

  END LOOP;

END;
$$ LANGUAGE plpgsql;


TRUNCATE astronauts.astronauts_super_powers_map  CASCADE;
TRUNCATE astronauts.astronauts CASCADE;
TRUNCATE astronauts.super_powers CASCADE;
--
