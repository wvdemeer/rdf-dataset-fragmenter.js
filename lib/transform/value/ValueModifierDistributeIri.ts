import type * as RDF from '@rdfjs/types';
import { DataFactory } from 'rdf-data-factory';
import type { IValueModifier } from './IValueModifier';

const DF = new DataFactory();

/**
 * A value modifier that that replaces (parts of) IRIs,
 * deterministically distributing the replacements over a list of multiple destination IRI, based on a matched number.
 *
 * This requires at least one group-based replacement, of which the first group must match a number.
 *
 * The matched number is used to choose one of the `replacementStrings` in a deterministic way:
 *    replacementStrings[number % replacementStrings.length]
 * This is the same as QuadTransformerDistributeIri and is thus compatible with it.
 */
export class ValueModifierDistributeIri implements IValueModifier {
  private readonly search: RegExp;
  private readonly replacements: string[];

  public constructor(searchRegex: string, replacementStrings: string[]) {
    this.search = new RegExp(searchRegex, 'u');
    this.replacements = replacementStrings;
  }

  public apply(value: RDF.Term): RDF.Term {
    const match = this.search.exec(value.value);
    if (match) {
      if (match.length < 2) {
        throw new Error(`ValueModifierDistributeIri error: The "searchRegex" did not contain any groups. ` +
            `QuadTransformerDistributeIri requires at least one group-based replacement, ` +
            `of which the first group must match a number.`);
      }
      const nr = Number.parseInt(match[1], 10);
      if (Number.isNaN(nr)) {
        throw new Error(`ValueModifierDistributeIri error: The first capture group in "searchRegex"` +
            ` must always match a number, but it matched "${match[1]}" instead.`);
      }
      const newValue = value.value.replace(this.search, this.replacements[nr % this.replacements.length]);
      return DF.literal(newValue);
    }
    return DF.literal(value.value);
  }
}
