import { DataFactory } from 'rdf-data-factory';
import { ValueModifierDistributeIri } from '../../../../lib/transform/value/ValueModifierDistributeIri';

const DF = new DataFactory();

describe('ValueModifierDistributeIri', () => {
  let modifier: ValueModifierDistributeIri;

  describe('with a replace group', () => {
    beforeEach(() => {
      modifier = new ValueModifierDistributeIri(
        '^http://www.ldbc.eu/data/pers([0-9]*)$',
        [ 'http://server1.ldbc.eu/pods/$1/profile/card#me', 'http://server2.ldbc.eu/pods/$1/profile/card#me' ],
      );
    });

    describe('apply', () => {
      it('should modify applicable values', async() => {
        expect(modifier.apply(
          DF.namedNode('http://www.ldbc.eu/data/pers0494'),
        )).toEqual(
          DF.literal('http://server1.ldbc.eu/pods/0494/profile/card#me'),
        );

        expect(modifier.apply(
          DF.namedNode('http://www.ldbc.eu/data/pers0495'),
        )).toEqual(
          DF.literal('http://server2.ldbc.eu/pods/0495/profile/card#me'),
        );

        expect(modifier.apply(
          DF.namedNode('http://example.com/data/pers0495'),
        )).toEqual(
          DF.literal('http://example.com/data/pers0495'),
        );
      });
    });
  });
});
